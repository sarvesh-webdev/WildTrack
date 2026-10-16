import "./SimilarMatches.css";

export default function SimilarMatches() {
  return (
    <section className="similar">
      <h3>Similar matches</h3>
      <p>Other individuals ranked by visual similarity</p>
      <div className="matches">
        <article>🐅 &nbsp; <b>Tiger #23</b> — 98.4% similarity</article>
        <article>🐅 &nbsp; <b>Tiger #17</b> — 86.2% similarity</article>
        <article>🐅 &nbsp; <b>Tiger #41</b> — 79.8% similarity</article>
      </div>
    </section>
  );
}
