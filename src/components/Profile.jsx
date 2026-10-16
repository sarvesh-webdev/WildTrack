import "./Profile.css";
import { tigerProfile } from "../data/tigerprofile";

export default function Profile() {
    const {
    name,
    species,
    gender,
    confidence,
    lastSeen,
    knownSince,
    status
  } = tigerProfile;
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

      <button className="open">Open animal profile →</button>
    </article>
  );
}