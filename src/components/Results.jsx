import Profile from "./Profile";
import { useRef,useEffect } from "react";
import { sampleResult } from "../data/sample";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./Results.css";

export function Results() {

 const videoRef = useRef(null);
 const canvasRef = useRef(null);

 useEffect(() => {
  // Start webcam
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait until video metadata (dimensions) is ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();

          // Load model only after video is ready
          cocoSsd.load().then(model => {
            const ctx = canvasRef.current.getContext("2d");

            const detectFrame = async () => {
              const predictions = await model.detect(videoRef.current);
              
                // if (predictions.length > 0) {
                //     console.log("Detections:", predictions);
                // } // debug log

              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

              predictions.forEach(pred => {
                const [x, y, w, h] = pred.bbox;
                ctx.strokeStyle = "lime";
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, w, h);
                ctx.fillStyle = "lime";
                ctx.fillText(
                  `${pred.class} ${Math.round(pred.score * 100)}%`,
                  x,
                  y > 10 ? y - 5 : 10
                );
              });

              requestAnimationFrame(detectFrame);
            };

            detectFrame();
          });
        };
      }
    })
    .catch(err => {
      console.error("Error accessing camera:", err);
    });
}, []);

  

  return (
    <section className="results">
      <div className="photo">
       <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="640"
        height="480"
        style={{ border: "1px solid #ccc" }}

      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>

        <span className="label">{sampleResult.animal} · {sampleResult.confidence}%</span>
        <span className="camera">▣ {sampleResult.camera} &nbsp; ▢ {sampleResult.date}</span>
      </div>
      <Profile />
    </section>
  );
}