import { useNavigate } from "react-router-dom";
import "./SimilarMatches.css";

export default function SimilarMatches({backendResult}) {
   const navigate = useNavigate();

  const handleGoToAnimal = () => {
    navigate("/animal"); // navigates to AnimalProfile route
  };
  return (
  <section className="similar-matches">
  <h2>Similar matches</h2>
  <p className="similar-subtitle">Other individuals ranked by visual similarity</p>

  <div className="match-grid">
    <article 
className="match-card">
      {(backendResult?.identity != null)?<img src={`/${backendResult?.identity}.png`}alt="Tiger #23" /> : <img src= "/TATR-T4.png"alt="Tiger #23" /> 

      }
      <div 
  className="match-details">
        <span 
    className="match-badge">{backendResult?.confidence != null ? Math.round(backendResult.confidence ):0}% match</span>
        <h3>{backendResult?.identity}</h3>
        <p>Adult male · Eastern Range</p>
        <div 
    className="match-stats"><span>Last seen</span><strong>Jun 18, 2024</strong></div>
        <button onClick={handleGoToAnimal}>View profile →</button>
      </div>
    </article>


  </div>
</section>
  );
}
