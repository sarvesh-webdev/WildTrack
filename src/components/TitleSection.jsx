import "./TitleSection.css";

export default function TitleSection() {
  return (
    <section className="title">
      <div>
        <small>IDENTIFICATION RESULT</small>
        <h1>Individual match found</h1>
        <p>AI-assisted re-identification from camera trap imagery.</p>
      </div>
      <button className="new">⇧ &nbsp; Start identification</button>
    </section>
  );
}
