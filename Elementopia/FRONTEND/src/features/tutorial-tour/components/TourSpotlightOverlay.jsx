import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTour } from "../context/TourContext";
import { TourTooltipCard } from "./TourTooltipCard";

export function TourSpotlightOverlay() {
  const { isOpen, currentStep } = useTour();
  const [targetRect, setTargetRect] = useState(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0, centered: true });
  const retryTimerRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!isOpen || !currentStep?.target) {
      setTargetRect(null);
      setCardPosition({ top: 0, left: 0, centered: true });
      return;
    }

    const element = document.querySelector(currentStep.target);
    if (!element) {
      // Element may still be rendering, retry shortly
      setTargetRect(null);
      setCardPosition({ top: 0, left: 0, centered: true });
      return;
    }

    const rect = element.getBoundingClientRect();
    const pad = 10;
    const paddedRect = {
      top: Math.max(0, rect.top - pad),
      left: Math.max(0, rect.left - pad),
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
      right: rect.right + pad,
      bottom: rect.bottom + pad,
    };

    setTargetRect(paddedRect);

    // Calculate smart card placement
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cardWidth = Math.min(440, viewportWidth - 32);
    const cardHeight = 280; // approximate height

    let left = rect.left + rect.width / 2 - cardWidth / 2;
    // Keep horizontally within viewport bounds
    left = Math.max(16, Math.min(viewportWidth - cardWidth - 16, left));

    let top = 0;
    const preferTop = currentStep.position === "top" || (paddedRect.bottom + cardHeight + 24 > viewportHeight && paddedRect.top > cardHeight + 24);

    if (preferTop) {
      top = Math.max(16, paddedRect.top - cardHeight - 16);
    } else {
      top = Math.min(viewportHeight - cardHeight - 16, paddedRect.bottom + 16);
    }

    setCardPosition({ top, left, centered: false });
  }, [isOpen, currentStep]);

  // Scroll into view & measure target on step change
  useEffect(() => {
    if (!isOpen || !currentStep?.target) return;

    let retries = 0;
    const tryFindAndScroll = () => {
      const element = document.querySelector(currentStep.target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        setTimeout(updatePosition, 180);
      } else if (retries < 5) {
        retries++;
        retryTimerRef.current = setTimeout(tryFindAndScroll, 120);
      } else {
        updatePosition();
      }
    };

    tryFindAndScroll();

    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [isOpen, currentStep, updatePosition]);

  // Window resize & scroll listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleEvent = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener("resize", handleEvent);
    window.addEventListener("scroll", handleEvent, true);

    return () => {
      window.removeEventListener("resize", handleEvent);
      window.removeEventListener("scroll", handleEvent, true);
    };
  }, [isOpen, updatePosition]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* SVG Mask for smooth translucent spotlight cutout */}
      <svg
        className="absolute inset-0 size-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="elementopia-tour-mask">
            {/* White reveals the dark backdrop */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cuts out the spotlight window over the target */}
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="18"
                ry="18"
                fill="black"
              />
            )}
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(2, 6, 23, 0.82)"
          mask="url(#elementopia-tour-mask)"
        />
      </svg>

      {/* Glowing Neon Ring around the Cutout Target */}
      {targetRect && (
        <div
          className="absolute rounded-2xl border-2 border-cyan-400 pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            boxShadow: "0 0 25px rgba(34, 211, 238, 0.6), inset 0 0 15px rgba(34, 211, 238, 0.3)",
          }}
        />
      )}

      {/* Floating Tour Tooltip Card */}
      {cardPosition.centered ? (
        <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
          <TourTooltipCard targetRect={targetRect} position="center" />
        </div>
      ) : (
        <div
          className="absolute transition-all duration-300 ease-out pointer-events-auto"
          style={{
            top: `${cardPosition.top}px`,
            left: `${cardPosition.left}px`,
          }}
        >
          <TourTooltipCard targetRect={targetRect} position={currentStep?.position} />
        </div>
      )}
    </div>
  );
}
