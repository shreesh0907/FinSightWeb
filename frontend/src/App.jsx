import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Simulator from "./pages/Simulator";
import Goals from "./pages/Goals";
import Recommendation from "./pages/Recommendation";

function App() {
  return (
    <BrowserRouter>
      {/* Full-page gradient overlay sitting above the CSS grid */}
      <div
        className="relative min-h-screen text-slate-200"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.18) 0%, transparent 70%)",
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/"               element={<Landing />} />
          <Route path="/dashboard"      element={<Dashboard />} />
          <Route path="/simulator"      element={<Simulator />} />
          <Route path="/goals"          element={<Goals />} />
          <Route path="/recommendation" element={<Recommendation />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;