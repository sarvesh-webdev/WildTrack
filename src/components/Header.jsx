import "./Header.css";

export default function Header() {
  return (
    <header>
      <input placeholder="Search species, ID or location..." />
      <button className="icon-button notification" aria-label="Notifications"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"></path><path d="M10 21h4"></path></svg></button>
    </header>
  );
}
