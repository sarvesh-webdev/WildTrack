import Profile from "./Profile";
import { useState,useRef,useEffect } from "react";
import { sampleResult } from "../data/sample";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./Results.css";

export function Results() {

 const videoRef = useRef(null);
 const canvasRef = useRef(null);

 const [animalType,setAnimalType] = useState('');
 const [prediction,setprediction] = useState(0);

  const [currentTime, setCurrentTime] = useState("");


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

            const animalClasses = [
            "dog", "cat", "horse", "sheep", "cow",
            "elephant", "bear", "zebra", "giraffe", "bird"
            ];

            const detectFrame = async () => {
              const predictions = await model.detect(videoRef.current);
              
                // if (predictions.length > 0) {
                //     console.log("Detections:", predictions);
                // } // debug log

              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

              predictions.forEach(pred => {
                if (!animalClasses.includes(pred.class)) return;

                let label = pred.class;
                if (label === "zebra") {
                 label = "tiger";
                }

                 
               setprediction(pred.score);
               setAnimalType(label);

                const [x, y, w, h] = pred.bbox;
                ctx.strokeStyle = "lime";
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, w, h);
                ctx.fillStyle = "lime";
                ctx.fillText(
                //   `${pred.class} ${Math.round(pred.score * 100)}%`,
                  `${label} ${Math.round(pred.score * 100)}%`,
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


    //handling time displaying

    const timer = setInterval(() => {
      const now = new Date();

      // Format for India Standard Time
      const formatted = now.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
      });

      // Add IST suffix
      setCurrentTime(formatted );
    }, 1000);

    return () => clearInterval(timer);
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


        <span className="label">{animalType} · {Math.round(prediction * 100)}%</span>
        <span className="camera">▣ {sampleResult.camera} &nbsp; ▢ {currentTime}</span>
      </div>
      <Profile />
    </section>
  );
}