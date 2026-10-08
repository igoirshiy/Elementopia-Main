import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SYSTEM_TOUR_STEPS } from "../config/systemTourSteps";

const TourContext = createContext(null);

const STORAGE_KEY = "elementopia_tour_completed";

export function TourProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const navigate = useNavigate();
  const location = useLocation();

  const currentStep = SYSTEM_TOUR_STEPS[currentStepIndex] || null;
  const totalSteps = SYSTEM_TOUR_STEPS.length;

  const startTour = useCallback((startIndex = 0) => {
    const validIndex = Math.max(0, Math.min(startIndex, SYSTEM_TOUR_STEPS.length - 1));
    const targetStep = SYSTEM_TOUR_STEPS[validIndex];
    
    // Ensure we are on the page where the target is located
    if (targetStep?.route && location.pathname !== targetStep.route) {
      navigate(targetStep.route);
    }
    
    setCurrentStepIndex(validIndex);
    setIsOpen(true);
  }, [location.pathname, navigate]);

  const finishTour = useCallback(() => {
    setIsOpen(false);
    setHasCompleted(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    
    // Dispatch custom event in case components want to listen
    window.dispatchEvent(new CustomEvent("elementopia:tour-finished"));
  }, []);

  const skipTour = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      setHasCompleted(true);
    } catch {}
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < SYSTEM_TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextTargetStep = SYSTEM_TOUR_STEPS[nextIndex];
      if (nextTargetStep?.route && location.pathname !== nextTargetStep.route) {
        navigate(nextTargetStep.route);
      }
      setCurrentStepIndex(nextIndex);
    } else {
      finishTour();
    }
  }, [currentStepIndex, finishTour, location.pathname, navigate]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      const prevTargetStep = SYSTEM_TOUR_STEPS[prevIndex];
      if (prevTargetStep?.route && location.pathname !== prevTargetStep.route) {
        navigate(prevTargetStep.route);
      }
      setCurrentStepIndex(prevIndex);
    }
  }, [currentStepIndex, location.pathname, navigate]);

  const goToStep = useCallback((index) => {
    if (index >= 0 && index < SYSTEM_TOUR_STEPS.length) {
      const target = SYSTEM_TOUR_STEPS[index];
      if (target?.route && location.pathname !== target.route) {
        navigate(target.route);
      }
      setCurrentStepIndex(index);
    }
  }, [location.pathname, navigate]);

  const resetTour = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasCompleted(false);
    } catch {}
    startTour(0);
  }, [startTour]);

  // Global keyboard shortcuts while tour is active
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevStep();
      } else if (e.key === "Escape") {
        e.preventDefault();
        skipTour();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextStep, prevStep, skipTour]);

  return (
    <TourContext.Provider
      value={{
        isOpen,
        currentStepIndex,
        currentStep,
        totalSteps,
        hasCompleted,
        startTour,
        nextStep,
        prevStep,
        goToStep,
        skipTour,
        finishTour,
        resetTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
