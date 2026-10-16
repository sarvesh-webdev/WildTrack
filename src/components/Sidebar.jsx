import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>🌿 WildTrack</h2>
      <p className="tagline">CONSERVATION INTELLIGENCE</p>

      <nav>
        <a>▦ &nbsp; Dashboard</a>
        <a className="active">◎ &nbsp; Identify</a>
        <a>▥ &nbsp; Analytics</a>
      </nav>

    </aside>
  );
}
