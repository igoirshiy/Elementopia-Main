import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const LandingPage = lazy(() => import('@/features/public-marketing/pages/LandingPage'));
const AboutUs = lazy(() => import('@/features/public-marketing/pages/AboutUs'));

const ElementopiaGame = lazy(() => import('@/features/resonance-puzzle/pages/ElementopiaGame'));
const StudentSandboxPage = lazy(() => import('@/features/resonance-puzzle/pages/StudentSandboxPage'));
const StudentElementMatcher = lazy(() => import('@/features/resonance-puzzle/pages/ElementMatcher'));
const StudentStateChanges = lazy(() => import('@/features/resonance-puzzle/pages/StudentStateChanges'));
const StudentCardMinigame = lazy(() => import('@/features/resonance-puzzle/pages/StudentCardMinigame'));

const PeriodicMatrixPage = lazy(() => import('@/features/periodic-matrix/pages/PeriodicMatrixPage'));
const DrAtomWorkshopPage = lazy(() => import('@/features/dr-atom-workshop/pages/DrAtomWorkshopPage'));
const StudentDiscoveryPage = lazy(() => import('@/features/student-discovery/pages/StudentDiscoveryPage'));
const CompoundGalleryPage = lazy(() => import('@/features/compound-gallery/pages/CompoundGalleryPage'));

const ChallengeLobby = lazy(() => import('@/features/multiplayer-challenge/pages/ChallengeLobby'));
const ResonanceSetup = lazy(() => import('@/features/multiplayer-challenge/pages/ResonanceSetup'));
const ChallengeMatch = lazy(() => import('@/features/multiplayer-challenge/pages/ChallengeMatch'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400 font-mono text-sm space-y-3">
      <div className="size-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
      <p className="tracking-widest uppercase text-xs text-slate-400">Loading Elementopia...</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about-us" element={<AboutUs />} />

          {/* Student Routes */}
          <Route path="/student-home-page" element={<ElementopiaGame />} />
          <Route path="/student/sandbox" element={<StudentSandboxPage />} />
          <Route path="/student/Chem-Simulation" element={<StudentSandboxPage />} />

          <Route path="/student/game1" element={<StudentElementMatcher />} />
          <Route path="/student/game2" element={<StudentStateChanges />} />
          <Route path="/student/game3" element={<StudentCardMinigame />} />

          {/* Periodic Matrix Route */}
          <Route path="/student/matrix" element={<PeriodicMatrixPage />} />
          <Route path="/student/periodic-matrix" element={<PeriodicMatrixPage />} />
          <Route path="/matrix" element={<PeriodicMatrixPage />} />
          <Route path="/periodic-matrix" element={<PeriodicMatrixPage />} />

          {/* Dr. Atom's Workshop Route */}
          <Route path="/student/workshop" element={<DrAtomWorkshopPage />} />
          <Route path="/student/dr-atom-workshop" element={<DrAtomWorkshopPage />} />
          <Route path="/workshop" element={<DrAtomWorkshopPage />} />

          {/* New Discovery Route */}
          <Route path="/student/discovery" element={<StudentDiscoveryPage />} />

          {/* Compound Gallery Route */}
          <Route path="/student/gallery" element={<CompoundGalleryPage />} />
          <Route path="/student/compound-gallery" element={<CompoundGalleryPage />} />
          <Route path="/gallery" element={<CompoundGalleryPage />} />

          {/* Elementopia Game */}
          <Route path="/student/elementopia" element={<ElementopiaGame />} />

          {/* Challenge Routes */}
          <Route path="/challenge" element={<ChallengeLobby />} />
          <Route path="/challenge/setup" element={<ResonanceSetup />} />
          <Route path="/challenge/:code" element={<ChallengeMatch />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
