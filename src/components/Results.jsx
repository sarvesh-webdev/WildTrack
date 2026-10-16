import Profile from "./Profile";
import "./Results.css";

export function Results() {
  return (
    <section className="results">
      <div className="photo">
        <img
          src="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1400&q=85"
          alt="Tiger"
        />
        <span className="label">Bengal tiger · 98.4%</span>
        <span className="camera">▣ CAM-04 &nbsp; ▢ Jun 18, 06:42</span>
      </div>
      <Profile />
    </section>
  );
}