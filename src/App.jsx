import Sidebar from "./Sidebar";
import Header from "./Header";
import TitleSection from "./TitleSection";
import { Results } from "./Results";
import Features from "./Features";
import SimilarMatches from "./SimilarMatches";

import './App.css'

function App() {
  

  return (
    <div className="app">
      <Sidebar />
      <main>
        <Header />
        <TitleSection />
        <Results />
        <Features />
        <SimilarMatches />
      </main>
    </div>
  );

  
}

export default App
