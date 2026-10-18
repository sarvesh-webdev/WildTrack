import Profile from "./Profile";
import { useState, useRef, useEffect } from "react";
import { sampleResult } from "../data/sample";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./Results.css";

export function Results({backendResult,setBackendResult}) {

  

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Backend request control only
  const lastSentRef = useRef(0);
  const isSendingRef = useRef(false);

  const [animalType, setAnimalType] = useState("");
  const [prediction, setprediction] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  const threshold = 0.7;

  // =========================================================
  // SEND CAMERA FRAME TO BACKEND
  // =========================================================

  async function sendFrameToBackend(video) {
    try {
      if (!video || video.readyState < 2) {
        console.log("Camera video is not ready");
        return;
      }

      // Create temporary canvas for backend image
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");

      // Capture ACTUAL camera frame
      ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Convert frame to JPEG
      const blob = await new Promise((resolve) => {
        canvas.toBlob(
          resolve,
          "image/jpeg",
          0.8
        );
      });

      if (!blob) {
        console.error("Failed to create image blob");
        return;
      }

      // Create multipart form data
      const formData = new FormData();

      formData.append(
        "file",
        blob,
        "camera-frame.jpg"
      );

      console.log("📤 Sending camera frame to /identify...");

      // Send image to FastAPI backend
      const response = await fetch(
        "http://127.0.0.1:8000/identify",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(
        "📥 Backend status:",
        response.status
      );

      if (!response.ok) {
        throw new Error(
          `Backend HTTP ${response.status}`
        );
      }

      const result = await response.json();

      

     

      console.log(
        "📥 Backend result:",
        result
      );

      setBackendResult(result);

      // =====================================================
      // HANDLE BACKEND RESULT
      // =====================================================

      if (result.success) {

        if (result.identity) {
          setAnimalType(result.identity);
        }

        if (
          typeof result.confidence === "number"
        ) {
          setprediction(result.confidence);
        }
      }

      return result;

    } catch (error) {

      console.error(
        "❌ Backend request failed:",
        error
      );

    }
  }

  // =========================================================
  // CONTROL BACKEND REQUESTS
  // COCO-SSD IS NOT DELAYED
  // =========================================================

  function handlePrediction(video, predictionScore) {
    const now = Date.now();

    // Backend confidence threshold
    if (predictionScore < threshold) {
      return;
    }

    // Don't send another backend request
    // while previous request is still running
    if (isSendingRef.current) {
      return;
    }

    // Backend cooldown only
    const cooldown = 3000;

    if (
      now - lastSentRef.current <
      cooldown
    ) {
      return;
    }

    // Mark request as sent
    lastSentRef.current = now;
    isSendingRef.current = true;

    console.log(
      "✅ COCO-SSD confidence:",
      Math.round(predictionScore * 100) + "%"
    );

    // Send actual camera video frame
    sendFrameToBackend(video)
      .finally(() => {
        isSendingRef.current = false;

        console.log(
          "🔓 Backend request finished"
        );
      });
  }

  // =========================================================
  // CAMERA + COCO-SSD
  // =========================================================

  useEffect(() => {

    // Start webcam
    navigator.mediaDevices
      .getUserMedia({
        video: true
      })
      .then((stream) => {

        if (videoRef.current) {

          videoRef.current.srcObject = stream;

          // Wait until video metadata is ready
          videoRef.current.onloadedmetadata = () => {

            videoRef.current.play();

            // Load COCO-SSD
            cocoSsd.load().then((model) => {

              const ctx =
                canvasRef.current.getContext("2d");

              const animalClasses = [
                "dog",
                "cat",
                "horse",
                "sheep",
                "cow",
                "elephant",
                "bear",
                "zebra",
                "giraffe",
                "bird"
              ];

              // =================================================
              // COCO-SSD DETECTION LOOP
              // =================================================

              const detectFrame = async () => {

                const predictions =
                  await model.detect(
                    videoRef.current
                  );

                // Clear overlay canvas
                ctx.clearRect(
                  0,
                  0,
                  ctx.canvas.width,
                  ctx.canvas.height
                );

                predictions.forEach((pred) => {

                  // Ignore objects outside animal classes
                  if (
                    !animalClasses.includes(
                      pred.class
                    )
                  ) {
                    return;
                  }

                  let label = pred.class;

                  // Keep your existing tiger mapping
                  if (label === "zebra") {
                    label = "tiger";
                  }

                  // =================================================
                  // UPDATE FRONTEND DISPLAY
                  // =================================================

                  setprediction(
                    pred.score
                  );

                  setAnimalType(
                    label
                  );

                  // =================================================
                  // SEND TO BACKEND
                  //
                  // IMPORTANT:
                  // videoRef.current is passed here.
                  //
                  // COCO-SSD CONTINUES RUNNING NORMALLY.
                  // Only backend requests are throttled.
                  // =================================================

                  handlePrediction(
                    videoRef.current,
                    pred.score
                  );

                  // =================================================
                  // DRAW BOUNDING BOX
                  // =================================================

                  const [
                    x,
                    y,
                    w,
                    h
                  ] = pred.bbox;

                  ctx.strokeStyle =
                    "lime";

                  ctx.lineWidth = 2;

                  ctx.strokeRect(
                    x,
                    y,
                    w,
                    h
                  );

                  ctx.fillStyle =
                    "lime";

                  ctx.fillText(
                    `${label} ${Math.round(
                      pred.score * 100
                    )}%`,
                    x,
                    y > 10
                      ? y - 5
                      : 10
                  );

                });

                // =================================================
                // CONTINUE COCO-SSD LOOP
                // =================================================

                requestAnimationFrame(
                  detectFrame
                );
              };

              // Start detection
              detectFrame();

            }).catch((err) => {

              console.error(
                "COCO-SSD model loading error:",
                err
              );

            });
          };
        }

      })
      .catch((err) => {

        console.error(
          "Error accessing camera:",
          err
        );

      });

    // =========================================================
    // TIME DISPLAY
    // =========================================================

    const timer = setInterval(() => {

      const now = new Date();

      const formatted =
        now.toLocaleString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
          }
        );

      setCurrentTime(
        formatted
      );

    }, 1000);

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {

      clearInterval(timer);

      if (videoRef.current) {

        const stream =
          videoRef.current.srcObject;

        if (stream) {

          stream
            .getTracks()
            .forEach((track) => {
              track.stop();
            });

        }
      }
    };

  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (
    <section className="results">

      <div className="photo">

        <div
          style={{
            position: "relative"
          }}
        >

          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="640"
            height="480"
            style={{
              border: "1px solid #ccc"
            }}
          />

          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            style={{
              position: "absolute",
              top: 0,
              left: 0
            }}
          />

        </div>

        <span className="label">
          {animalType} ·{" "}
          {Math.round(
            prediction * 100
          )}
          %
        </span>

        <span className="camera">
          ▣ {sampleResult.camera}
          &nbsp;
          ▢ {currentTime}
        </span>

      </div>

      <Profile backendResult={backendResult}/>

    </section>
  );
}