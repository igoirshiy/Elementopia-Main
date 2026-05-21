import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Student Pages
import LandingPage from "./student/LandingPage";
import LoginCard from "./student/login-card";
import RegisterCard from "./student/register-card";
import AboutUs from "./student/about-us";
import StudentHomePage from "./student/StudentHomePage";
import StudentSandboxPage from "./student/StudentSandboxPage";

import StudentElementMatcher from "./student/ElementMatcher";
import StudentStateChanges from "./student/StudentStateChanges";
import StudentCardMinigame from "./student/StudentCardMinigame";
import StudentDiscoveryPage from "./student/StudentDiscoveryPage";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<LoginCard />} />
        <Route path="/sign-up" element={<RegisterCard />} />

        {/* Student Routes - Public Now */}
        <Route path="/student-home-page" element={<StudentHomePage />} />
        <Route path="/student/sandbox" element={<StudentSandboxPage />} />
        <Route path="/student/Chem-Simulation" element={<StudentSandboxPage />} />

        <Route path="/student/game1" element={<StudentElementMatcher />} />
        <Route path="/student/game2" element={<StudentStateChanges />} />
        <Route path="/student/game3" element={<StudentCardMinigame />} />
        
        {/* New Discovery Route */}
        <Route path="/student/discovery" element={<StudentDiscoveryPage />} />
      </Routes>
    </Router>
  );
}
