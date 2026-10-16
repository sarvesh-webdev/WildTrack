import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TitleSection from "./components/TitleSection";
import { Results } from "./components/Results";
import Features from "./components/Features";
import SimilarMatches from "./components/SimilarMatches";


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
