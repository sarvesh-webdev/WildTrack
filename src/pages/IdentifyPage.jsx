import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TitleSection from "../components/TitleSection";
import { Results } from "../components/Results";
import { useState } from "react";
import SimilarMatches from "../components/SimilarMatches";
import "./IdentifyPage.css";

export default function IdentifyPage() {
  const [backendResult,setBackendResult] = useState({});
  return (
    <div className="app">
       <Sidebar />
      <main>
        <Header />
        <TitleSection />
        <Results setBackendResult={setBackendResult} backendResult={backendResult}/>
        <SimilarMatches />
      </main>
    </div>
  );
}
