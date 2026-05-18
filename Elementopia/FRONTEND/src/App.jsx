import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Student Pages
import LandingPage from "./STUDENT/LandingPage";
import LoginCard from "./STUDENT/login-card";
import RegisterCard from "./STUDENT/register-card";
import AboutUs from "./STUDENT/about-us";
import StudentHomePage from "./STUDENT/StudentHomePage";
import StudentSandboxPage from "./STUDENT/StudentSandboxPage";
import ChallengePage from "./components/Student Components/ChallengePage";
import StudentElementMatcher from "./STUDENT/ElementMatcher";
import StudentStateChanges from "./STUDENT/StudentStateChanges";
import StudentCardMinigame from "./STUDENT/StudentCardMinigame";


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
        <Route path="/student/daily-challenge" element={<ChallengePage />} />
        <Route path="/student/game1" element={<StudentElementMatcher />} />
        <Route path="/student/game2" element={<StudentStateChanges />} />
        <Route path="/student/game3" element={<StudentCardMinigame />} />
      </Routes>
    </Router>
  );
}
