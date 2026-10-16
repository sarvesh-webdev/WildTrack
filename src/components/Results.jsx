import Profile from "./Profile";
import { useRef,useEffect } from "react";
import "./Results.css";

export function Results() {

 const videoRef = useRef(null);

 useEffect(() => {

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
      });
  }, []);

  

  return (
    <section className="results">
      <div className="photo">
       <video
            ref={videoRef}
            autoPlay
            playsInline
            // style={{
            //     width: "100%",
            //     maxWidth: "600px",
            //     borderRadius: "12px",
            //     border: "2px solid #ccc",
            //     backgroundColor: "#000"
            // }}
            />

        <span className="label">Bengal tiger · 98.4%</span>
        <span className="camera">▣ CAM-01 &nbsp; ▢ Jun 18, 06:42</span>
      </div>
      <Profile />
    </section>
  );
}