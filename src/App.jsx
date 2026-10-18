import { Routes, Route } from "react-router-dom";
import IdentifyPage from "./pages/IdentifyPage";
import AnimalProfile from "./pages/AnimalProfilePage";
import { useState } from "react";

function App() {
  const [backendResult,setBackendResult] = useState(null);

  return (
  
      <Routes>
        <Route path="/" element={<IdentifyPage backendResult={backendResult} setBackendResult={setBackendResult}/>} />
        <Route path="/animal" element={<AnimalProfile backendResult={backendResult}/>} />
      </Routes>
    
  );
}

export default App;
