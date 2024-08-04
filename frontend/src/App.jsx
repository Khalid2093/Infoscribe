import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard";
import Video from "./pages/video";

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/video/:id/:start_second" element={<Video />} />
          {/* <Route path="/video" element={<Video />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
