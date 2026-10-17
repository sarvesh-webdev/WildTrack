import { Routes, Route } from "react-router-dom";
import IdentifyPage from "./pages/IdentifyPage";
import AnimalProfile from "./pages/AnimalProfilePage";

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<IdentifyPage />} />
        <Route path="/animal" element={<AnimalProfile />} />
      </Routes>
    
  );
}

export default App;
