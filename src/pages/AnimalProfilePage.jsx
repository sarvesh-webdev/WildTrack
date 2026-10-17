import Sidebar from "../components/Sidebar";
import "./AnimalProfilePage.css";

export default function AnimalProfile() {
  return (
    <div className="animal-profile">
      
      <main class="page">
        <Sidebar />
    <header class="topbar">
      <span class="search">⌕ &nbsp; Search species, ID or location...</span>
      <span class="avatar">AM</span>
    </header>

    <div class="content">
      <a class="back" href="/">← Back to identification</a>

      <section class="profile-heading">
        <div>
          <p class="eyebrow">ANIMAL PROFILE</p>
          <h1>Tiger #23</h1>
          <p class="subtitle">Bengal tiger · <i>Panthera tigris tigris</i></p>
        </div>
        <span class="status">● &nbsp; Active individual</span>
      </section>

      <section class="profile-grid">
        <article class="photo-card">
          <img
            src="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1400&q=85"
            alt="Tiger #23 in its forest habitat"
          />
          <span class="photo-tag">Bengal tiger</span>
          <div class="photo-caption">
            <b>Tiger #23</b>
            <span>Last captured by CAM-04 · Jun 18, 06:42</span>
          </div>
        </article>

        <article class="details-card">
          <p class="eyebrow">INDIVIDUAL DETAILS</p>
          <h2>About this tiger</h2>

          <div class="detail-row"><span>Species</span><b>Bengal tiger</b></div>
          <div class="detail-row"><span>Sex</span><b>Adult male</b></div>
          <div class="detail-row"><span>Known since</span><b>March 2022</b></div>
          <div class="detail-row"><span>Last seen</span><b>Jun 18, 2024</b></div>

          <div class="confidence-box">
            <div><span>Identification confidence</span><b>98.4%</b></div>
            <div class="progress"><span></span></div>
          </div>
        </article>
      </section>

      <section class="location-section">
        <div class="location-heading">
          <div>
            <p class="eyebrow">PREDICTED CAMERA LOCATION</p>
            <h2>Recent location</h2>
            <p>Camera-trap location associated with the latest sighting.</p>
          </div>
          <span class="location-chip">⌖ &nbsp; Bandhavgarh Reserve</span>
        </div>

        <div class="map-wrap">
          <div id="map" aria-label="Map showing the predicted camera location"></div>
          <div class="map-note">
            <span class="map-pin">⌖</span>
            <div><b>CAM-04 · Predicted location</b><small>23.7225° N, 81.0242° E</small></div>
          </div>
        </div>
      </section>

      <section class="sighting-card">
        <div>
          <p class="eyebrow">LATEST SIGHTING</p>
          <h2>Camera trap observation</h2>
          <p>Bandhavgarh Reserve · Eastern Range</p>
        </div>
        <div class="sighting-date"><b>June 18, 2024</b><span>06:42 AM</span></div>
      </section>
    </div>
  </main>
    </div>
  );

}
