import "./Profile.css";
import { tigerProfile } from "../data/tigerprofile";
import { useNavigate } from "react-router-dom";

export default function Profile({backendResult}) {
    const {
    species,
    gender,
    lastSeen,
    knownSince
  } = tigerProfile;

   function getConfidenceStatus(confidence) {
  if (confidence >= 90) {
    return "High confidence match";
  }

  if (confidence >= 70) {
    return "Moderate confidence match";
  }

  return "Low confidence match — needs review";
}

const confidence = backendResult?.confidence != null ? Math.round(backendResult.confidence ):0;
const status = getConfidenceStatus(confidence); 

const name = backendResult?.identity;
  
  const navigate = useNavigate();

  const handleGoToAnimal = () => {
    navigate("/animal"); // navigates to AnimalProfile route
  };

  return (
    <article className="profile">
      <span className="confidence">✓ {status}</span>
      <small>PREDICTED IDENTITY</small>
      <h2>{name}</h2>
      <p>{gender} · <i> {species}</i></p>

      <div className="score">Match confidence <strong>{confidence}%</strong></div>
      <div className="progress" ><span style={{width:`${confidence}%`}}></span></div>

      <p>📍 &nbsp; Last seen<br /><b>{lastSeen}</b></p>
      <p>▢ &nbsp; Known since<br /><b>{knownSince}</b></p>

      <button className="open" onClick={handleGoToAnimal}>Open animal profile →</button>
    </article>
  );
}