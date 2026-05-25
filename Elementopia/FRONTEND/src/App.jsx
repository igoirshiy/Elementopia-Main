import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Student Pages
import LandingPage from '@/pages/public/LandingPage';
import AboutUs from '@/pages/public/AboutUs';
import StudentSandboxPage from '@/pages/student/StudentSandboxPage';

import StudentElementMatcher from '@/pages/student/ElementMatcher';
import StudentStateChanges from '@/pages/student/StudentStateChanges';
import StudentCardMinigame from '@/pages/student/StudentCardMinigame';
import StudentDiscoveryPage from '@/pages/student/StudentDiscoveryPage';
import ElementopiaGame from '@/pages/student/ElementopiaGame';
import ChallengeLobby from '@/pages/student/ChallengeLobby';
import ResonanceSetup from '@/pages/student/ResonanceSetup';
import ChallengeMatch from '@/pages/student/ChallengeMatch';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about-us" element={<AboutUs />} />

        {/* Student Routes - Public Now */}
        <Route path="/student-home-page" element={<ElementopiaGame />} />
        <Route path="/student/sandbox" element={<StudentSandboxPage />} />
        <Route path="/student/Chem-Simulation" element={<StudentSandboxPage />} />

        <Route path="/student/game1" element={<StudentElementMatcher />} />
        <Route path="/student/game2" element={<StudentStateChanges />} />
        <Route path="/student/game3" element={<StudentCardMinigame />} />
        
        {/* New Discovery Route */}
        <Route path="/student/discovery" element={<StudentDiscoveryPage />} />

        {/* Elementopia Game */}
        <Route path="/student/elementopia" element={<ElementopiaGame />} />

        {/* Challenge Routes */}
        <Route path="/challenge" element={<ChallengeLobby />} />
        <Route path="/challenge/setup" element={<ResonanceSetup />} />
        <Route path="/challenge/:code" element={<ChallengeMatch />} />
      </Routes>
    </Router>
  );
}
