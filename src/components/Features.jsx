import "./Features.css";

export default function Features() {
  return (
    <section className="features">
      <nav className="tabs">
        <a className="selected">Visual Features</a>
        <a>Location Data</a>
        <a>Time Captured</a>
      </nav>

      <h3>Visual Features</h3>
      <p>Unique stripe geometry and facial landmark analysis power this match.</p>
      <p>Right flank <b>99.1%</b></p>
      <p>Facial markings <b>97.8%</b></p>
      <p>Body profile <b>94.6%</b></p>
    </section>
  );
}
