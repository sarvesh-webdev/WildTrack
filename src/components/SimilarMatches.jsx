import "./SimilarMatches.css";

export default function SimilarMatches() {
  return (
  <section class="similar-matches">
  <h2>Similar matches</h2>
  <p class="similar-subtitle">Other individuals ranked by visual similarity</p>

  <div class="match-grid">
    <article class="match-card">
      <img src="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&q=85" alt="Tiger #23" />
      <div class="match-details">
        <span class="match-badge">98.4% match</span>
        <h3>Tiger #23</h3>
        <p>Adult male · Eastern Range</p>
        <div class="match-stats"><span>Last seen</span><strong>Jun 18, 2024</strong></div>
        <button>View profile →</button>
      </div>
    </article>

    <article class="match-card">
      <img src="https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=900&q=85" alt="Tiger #17" />
      <div class="match-details">
        <span class="match-badge">86.2% match</span>
        <h3>Tiger #17</h3>
        <p>Adult female · Central Range</p>
        <div class="match-stats"><span>Last seen</span><strong>May 29, 2024</strong></div>
        <button>View profile →</button>
      </div>
    </article>

    <article class="match-card">
      <img src="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&q=85" alt="Tiger #41" />
      <div class="match-details">
        <span class="match-badge">79.8% match</span>
        <h3>Tiger #41</h3>
        <p>Adult male · Southern Range</p>
        <div class="match-stats"><span>Last seen</span><strong>Apr 12, 2024</strong></div>
        <button>View profile →</button>
      </div>
    </article>
  </div>
</section>
  );
}
