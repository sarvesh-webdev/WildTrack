import * as ort from "onnxruntime-web";

/*
 * Re-Wild AnimalMatcher
 *
 * Model: ResNet-50 exported to ONNX from Colab
 * Embedding size: 2048
 * Input: live camera frame (Blob, File, or HTMLCanvasElement)
 *
 * Expected public assets:
 * public/models/animal_encoder.onnx
 * public/data/ATRW_embeddings.bin
 * public/data/ATRW_metadata.json
 * public/data/Deer_embeddings.bin
 * public/data/Deer_metadata.json
 * public/data/Leopard_embeddings.bin
 * public/data/Leopard_metadata.json
 */

const DIMENSIONS = 2048;
const IMAGE_SIZE = 224;
const RESIZE_SIZE = 256;

const DATASETS = {
  ATRW: {
    embeddings: "data/ATRW_embeddings.bin",
    metadata: "data/ATRW_metadata.json",
  },
  Deer: {
    embeddings: "data/Deer_embeddings.bin",
    metadata: "data/Deer_metadata.json",
  },
  Leopard: {
    embeddings: "data/Leopard_embeddings.bin",
    metadata: "data/Leopard_metadata.json",
  },
};

const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

function asset(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function cosineSimilarity(a, b) {
  // Both vectors must be L2-normalized.
  let score = 0;

  for (let i = 0; i < a.length; i++) {
    score += a[i] * b[i];
  }

  return score;
}

async function responseOrThrow(response, description) {
  if (!response.ok) {
    throw new Error(
      `${description} failed: HTTP ${response.status}. ` +
      "Check that the file exists in your public folder."
    );
  }

  return response;
}

export class AnimalMatcher {
  constructor({
    modelPath = "models/animal_encoder.onnx",
    topK = 5,
    matchThreshold = null,
  } = {}) {
    this.modelPath = modelPath;
    this.topK = topK;

    // Leave null until you calibrate a threshold using test images.
    this.matchThreshold = matchThreshold;

    this.session = null;
    this.datasetCache = new Map();
    this.initializing = null;
    this.inferenceBusy = false;
  }

  // --------------------------------------------------
  // 1. Load the AI model once
  // --------------------------------------------------

  async initialize() {
    if (this.session) return this.session;

    if (this.initializing) return this.initializing;

    this.initializing = (async () => {
      this.session = await ort.InferenceSession.create(
        asset(this.modelPath),
        {
          executionProviders: ["wasm"],
        }
      );

      if (
        this.session.inputNames.length === 0 ||
        this.session.outputNames.length === 0
      ) {
        throw new Error("The ONNX model has no usable input/output.");
      }

      return this.session;
    })();

    try {
      return await this.initializing;
    } catch (error) {
      this.session = null;
      throw error;
    } finally {
      this.initializing = null;
    }
  }

  // --------------------------------------------------
  // 2. Load embeddings and metadata for one dataset
  // --------------------------------------------------

  async loadDataset(datasetName) {
    const config = DATASETS[datasetName];

    if (!config) {
      throw new Error(
        `Unknown dataset "${datasetName}". ` +
        `Choose ${Object.keys(DATASETS).join(", ")}.`
      );
    }

    if (this.datasetCache.has(datasetName)) {
      return this.datasetCache.get(datasetName);
    }

    const loadPromise = (async () => {
      const [binaryResponse, metadataResponse] = await Promise.all([
        fetch(asset(config.embeddings)),
        fetch(asset(config.metadata)),
      ]);

      await responseOrThrow(
        binaryResponse,
        `${datasetName} embeddings`
      );

      await responseOrThrow(
        metadataResponse,
        `${datasetName} metadata`
      );

      const [buffer, metadata] = await Promise.all([
        binaryResponse.arrayBuffer(),
        metadataResponse.json(),
      ]);

      if (!Array.isArray(metadata.records)) {
        throw new Error(
          `${datasetName} metadata must contain a records array.`
        );
      }

      if (buffer.byteLength % Float32Array.BYTES_PER_ELEMENT !== 0) {
        throw new Error(
          `${datasetName} binary file has an invalid byte length.`
        );
      }

      const vectors = new Float32Array(buffer);
      const recordCount = metadata.records.length;

      if (vectors.length !== recordCount * DIMENSIONS) {
        throw new Error(
          `${datasetName} data mismatch: found ${vectors.length} ` +
          `numbers for ${recordCount} records. Expected ` +
          `${recordCount * DIMENSIONS}. Check dimensions and export order.`
        );
      }

      if (metadata.dimensions != null &&
          metadata.dimensions !== DIMENSIONS) {
        throw new Error(
          `${datasetName} metadata declares ${metadata.dimensions} ` +
          `dimensions, but this matcher expects ${DIMENSIONS}.`
        );
      }

      const dataset = {
        name: datasetName,
        vectors,
        records: metadata.records,
        count: recordCount,
        dimensions: DIMENSIONS,
      };

      return dataset;
    })();

    // Cache the promise too, so simultaneous calls don't download twice.
    this.datasetCache.set(datasetName, loadPromise);

    try {
      const dataset = await loadPromise;
      this.datasetCache.set(datasetName, dataset);
      return dataset;
    } catch (error) {
      this.datasetCache.delete(datasetName);
      throw error;
    }
  }

  // --------------------------------------------------
  // 3. Accept camera frames, images, Blobs, Files or canvases
  // --------------------------------------------------

  async createBitmap(source) {
    if (source instanceof HTMLCanvasElement) {
      return createImageBitmap(source);
    }

    if (source instanceof Blob) {
      return createImageBitmap(source);
    }

    if (source instanceof HTMLVideoElement) {
      if (source.readyState < 2 || !source.videoWidth) {
        throw new Error("Camera video is not ready yet.");
      }

      return createImageBitmap(source);
    }

    if (source instanceof HTMLImageElement) {
      if (!source.complete || !source.naturalWidth) {
        throw new Error("Image has not loaded yet.");
      }

      return createImageBitmap(source);
    }

    throw new Error(
      "Unsupported frame. Pass a Blob, File, canvas, video or image element."
    );
  }

  // --------------------------------------------------
  // 4. Preprocess exactly like the expected ResNet weights
  // --------------------------------------------------

  async imageToTensor(source) {
    const bitmap = await this.createBitmap(source);

    try {
      // Resize the shorter side to 256, keeping aspect ratio.
      const scale =
        RESIZE_SIZE / Math.min(bitmap.width, bitmap.height);

      const resizedWidth = Math.round(bitmap.width * scale);
      const resizedHeight = Math.round(bitmap.height * scale);

      const resizedCanvas = document.createElement("canvas");
      resizedCanvas.width = resizedWidth;
      resizedCanvas.height = resizedHeight;

      const resizedContext = resizedCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!resizedContext) {
        throw new Error("Could not create image processing canvas.");
      }

      resizedContext.drawImage(
        bitmap,
        0,
        0,
        resizedWidth,
        resizedHeight
      );

      // Center crop to 224 x 224.
      const left = Math.floor((resizedWidth - IMAGE_SIZE) / 2);
      const top = Math.floor((resizedHeight - IMAGE_SIZE) / 2);

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = IMAGE_SIZE;
      cropCanvas.height = IMAGE_SIZE;

      const cropContext = cropCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!cropContext) {
        throw new Error("Could not create image crop canvas.");
      }

      cropContext.drawImage(
        resizedCanvas,
        left,
        top,
        IMAGE_SIZE,
        IMAGE_SIZE,
        0,
        0,
        IMAGE_SIZE,
        IMAGE_SIZE
      );

      const pixels = cropContext.getImageData(
        0,
        0,
        IMAGE_SIZE,
        IMAGE_SIZE
      ).data;

      const planeSize = IMAGE_SIZE * IMAGE_SIZE;
      const tensorData = new Float32Array(3 * planeSize);

      // Canvas pixels are RGBA. ONNX expects RGB, NCHW.
      for (let i = 0; i < planeSize; i++) {
        for (let channel = 0; channel < 3; channel++) {
          const value = pixels[i * 4 + channel] / 255;

          tensorData[channel * planeSize + i] =
            (value - MEAN[channel]) / STD[channel];
        }
      }

      return new ort.Tensor(
        "float32",
        tensorData,
        [1, 3, IMAGE_SIZE, IMAGE_SIZE]
      );
    } finally {
      bitmap.close();
    }
  }

  // --------------------------------------------------
  // 5. Generate an embedding for one frame
  // --------------------------------------------------

  async embedFrame(source) {
    const session = await this.initialize();
    const inputTensor = await this.imageToTensor(source);

    const inputName = session.inputNames[0];
    const outputName = session.outputNames[0];

    const outputs = await session.run({
      [inputName]: inputTensor,
    });

    const raw = outputs[outputName].data;

    if (raw.length !== DIMENSIONS) {
      throw new Error(
        `Model returned ${raw.length} values, expected ${DIMENSIONS}.`
      );
    }

    const embedding = Float32Array.from(raw);

    // L2-normalize so the dot product is cosine similarity.
    let squaredNorm = 0;

    for (const value of embedding) {
      squaredNorm += value * value;
    }

    const norm = Math.sqrt(squaredNorm);

    if (!Number.isFinite(norm) || norm === 0) {
      throw new Error("The model generated an invalid embedding.");
    }

    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= norm;
    }

    return embedding;
  }

  // --------------------------------------------------
  // 6. Compare a frame against a selected dataset
  // --------------------------------------------------

  async matchFrame(
    source,
    datasetName,
    { topK = this.topK, threshold = this.matchThreshold } = {}
  ) {
    // For live video, skip a new frame if inference is still running.
    if (this.inferenceBusy) {
      return {
        skipped: true,
        reason: "Previous frame is still being processed.",
      };
    }

    this.inferenceBusy = true;

    try {
      const [queryEmbedding, dataset] = await Promise.all([
        this.embedFrame(source),
        this.loadDataset(datasetName),
      ]);

      const { vectors, records } = dataset;
      const results = [];

      for (let row = 0; row < records.length; row++) {
        const offset = row * DIMENSIONS;
        const referenceEmbedding = vectors.subarray(
            offset,
            offset + DIMENSIONS
            );

            const score = cosineSimilarity(
            queryEmbedding,
            referenceEmbedding
            );
        const record = records[row];

        results.push({
          dataset: datasetName,
          identityId: record.identity_id ?? "unknown",
          imagePath: record.image_path ?? null,
          similarity: score,
        });
      }

      results.sort((a, b) => b.similarity - a.similarity);

      const bestMatch = results[0] ?? null;

      // A threshold must be calibrated with real test images.
      const accepted =
        bestMatch !== null &&
        (threshold == null || bestMatch.similarity >= threshold);

      return {
        skipped: false,
        dataset: datasetName,
        accepted,
        status: !bestMatch
          ? "no_reference_images"
          : accepted
            ? "closest_match_found"
            : "unknown",
        bestMatch: accepted ? bestMatch : null,
        closestMatch: bestMatch,
        topMatches: results.slice(0, Math.max(1, topK)),
        referenceCount: dataset.count,
      };
    } finally {
      this.inferenceBusy = false;
    }
  }

  // Short alias if your frontend already calls matcher.match(...)
  async match(source, datasetName, topK = this.topK) {
    return this.matchFrame(source, datasetName, { topK });
  }

  // Release resources if the application no longer needs the model.
  async dispose() {
    if (this.session) {
      await this.session.release();
      this.session = null;
    }

    this.datasetCache.clear();
  }
}

export default AnimalMatcher;