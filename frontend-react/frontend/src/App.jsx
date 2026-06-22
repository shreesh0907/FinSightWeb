import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileSetup from "./pages/ProfileSetup";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Simulator from "./pages/Simulator";
import Goals from "./pages/Goals";
import Recommendation from "./pages/Recommendation";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div
          className="relative min-h-screen text-slate-200"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.18) 0%, rgba(15,23,42,0) 65%), #020617",
          }}
        >
          <Navbar />

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>}/>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/recommendation" element={<ProtectedRoute><Recommendation /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;