import { Routes, Route, Navigate } from "react-router-dom";
import Garage from "./components/Garage/Garage";
import Winners from "./components/Winners/Winners";
import Header from "./components/Header/Header";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/garage" replace />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/winners" element={<Winners />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
