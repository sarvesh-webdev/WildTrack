import Sidebar from "../components/Sidebar";
import "./AnimalProfilePage.css";
import 'leaflet/dist/leaflet.css';


export default function AnimalProfile({backendResult}) {
  const confidence = backendResult?.confidence != null ? Math.round(backendResult.confidence ):0;


const name = backendResult?.identity;
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
          <h1>{name}</h1>
          <p class="subtitle">Bengal tiger · <i>Panthera tigris tigris</i></p>
        </div>
        <span class="status">● &nbsp; Active individual</span>
      </section>

      <section class="profile-grid">
        <article class="photo-card">
           {(backendResult?.identity != null)?<img src={`/${backendResult?.identity}.png`}alt="Tiger #23" /> : <img src= "/TATR-T4.png"alt="Tiger #23" /> 

      }
          <span class="photo-tag">{name}</span>
          <div class="photo-caption">
            <b>{name}</b>
            <span>Last captured by CAM-04 · Jun 18, 06:42</span>
          </div>
        </article>

        <article class="details-card">
          <p class="eyebrow">INDIVIDUAL DETAILS</p>
          <h2>About this tiger</h2>

          <div class="detail-row"><span>Species</span><b> {name}</b></div>
          <div class="detail-row"><span>Sex</span><b>Adult male</b></div>
          <div class="detail-row"><span>Known since</span><b>March 2022</b></div>
          <div class="detail-row"><span>Last seen</span><b>Jun 18, 2024</b></div>

          <div class="confidence-box">
            <div><span>Identification confidence</span><b>{confidence}%</b></div>
            <div class="progress"><span style={{width:`${confidence}%`}}></span></div>
          </div>
        </article>
      </section>

      {/* <section class="location-section">
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
      </section> */}
<section class="location-section">
        <div class="location-heading">
          <div>
            <p class="eyebrow">CAMERA NETWORK</p>
            <h2>Tadoba camera locations</h2>
            <p>Demo camera positions, tiger location, and nearby village.</p>
          </div>
          <span id="zoneStatus" class="zone-status">Checking village zone…</span>
        </div>

        <div id="map" aria-label="Interactive OpenStreetMap showing Tadoba cameras"><img src="/map.jpeg" /></div>

        <div class="map-legend">
          <span><i class="legend-dot camera-dot"></i> Camera</span>
          <span><i class="legend-dot tiger-dot"></i> Tiger #23</span>
          <span><i class="legend-dot village-dot"></i> Village</span>
          <span><i class="legend-line"></i> Camera connection</span>
          <span><i class="legend-zone"></i> 1 km alert zone</span>
        </div>

        <div id="officerAlert" class="officer-alert" hidden>
          <div>
            <strong>⚠ Village in danger zone</strong>
            <p id="alertText">Tiger #23 is near the village.</p>
          </div>
          <button id="notifyOfficer" type="button">Notify officer</button>
        </div>

        <p id="notificationMessage" class="notification-message" hidden></p>
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
