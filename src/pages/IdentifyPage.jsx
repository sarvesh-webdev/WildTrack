import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TitleSection from "../components/TitleSection";
import { Results } from "../components/Results";
import SimilarMatches from "../components/SimilarMatches";
import "./IdentifyPage.css";

export default function IdentifyPage() {
  return (
    <div className="app">
       <Sidebar />
      <main>
        <Header />
        <TitleSection />
        <Results />
        <SimilarMatches />
      </main>
    </div>
  );
}
