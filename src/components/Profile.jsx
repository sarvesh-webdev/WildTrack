import "./Profile.css";

export default function Profile() {
  return (
    <article className="profile">
      <span className="confidence">✓ High confidence match</span>
      <small>PREDICTED IDENTITY</small>
      <h2>Tiger #23</h2>
      <p>Adult male · <i>Panthera tigris tigris</i></p>

      <div className="score">Match confidence <strong>98.4%</strong></div>
      <div className="progress"><span></span></div>

      <p>📍 &nbsp; Last seen<br /><b>Eastern Range</b></p>
      <p>▢ &nbsp; Known since<br /><b>March 2022</b></p>

      <button className="open">Open animal profile →</button>
    </article>
  );
}