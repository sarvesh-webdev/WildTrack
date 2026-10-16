import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>🌿 WildTrack</h2>
      <p className="tagline">CONSERVATION INTELLIGENCE</p>

      <nav>
        <a>▦ &nbsp; Dashboard</a>
        <a>⇧ &nbsp; Upload</a>
        <a className="active">◎ &nbsp; Identify</a>
        <a>▥ &nbsp; Analytics</a>
        <a>⚙ &nbsp; Settings</a>
      </nav>

      <div className="impact">
        <h3>✧ AI for the wild</h3>
        <p>Every match helps researchers protect vulnerable species.</p>
        <a>View impact →</a>
      </div>
    </aside>
  );
}
