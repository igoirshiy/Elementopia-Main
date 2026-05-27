import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Feature Slices Pages
import { LandingPage, AboutUs } from '@/features/public-marketing';
import { ElementopiaGame, StudentSandboxPage, StudentElementMatcher, StudentStateChanges, StudentCardMinigame } from '@/features/resonance-puzzle';
import { ChallengeLobby, ResonanceSetup, ChallengeMatch } from '@/features/multiplayer-challenge';
import { StudentDiscoveryPage } from '@/features/student-discovery';


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
