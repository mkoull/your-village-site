"use client";

import { useEffect, useRef, useState } from "react";

const SERVICE_NODES = [
  { label: "Sleep Support" },
  { label: "Nourishing Meals" },
  { label: "Lactation" },
  { label: "Emotional Care" },
  { label: "Home Care" },
  { label: "Life Admin" },
  { label: "Overnight Help" },
  { label: "Partner Support" },
];

// SVG connector endpoints (matches the 8-node circle on a 600x600 viewBox)
const CONNECTORS = [
  { x2: 300, y2: 120 },
  { x2: 427, y2: 173 },
  { x2: 480, y2: 300 },
  { x2: 427, y2: 427 },
  { x2: 300, y2: 480 },
  { x2: 173, y2: 427 },
  { x2: 120, y2: 300 },
  { x2: 173, y2: 173 },
];

export default function VillageLoader() {
  const [dismissed, setDismissed] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dismissDelay = prefersReduced ? 400 : 4200;

    // Counter-rotate labels so they stay readable during orbit
    if (!prefersReduced && orbitRef.current) {
      let startTime: number | null = null;
      let orbitStarted = false;
      const orbit = orbitRef.current;

      function counterRotate(timestamp: number) {
        if (!orbit || !orbit.isConnected) return;
        if (!orbitStarted) {
          if (!startTime) startTime = timestamp;
          if (timestamp - startTime < 3500) {
            requestAnimationFrame(counterRotate);
            return;
          }
          orbitStarted = true;
          startTime = timestamp;
        }
        const elapsed = (timestamp - startTime!) / 1000;
        const degrees = (elapsed / 90) * 360;
        const nodes = orbit.querySelectorAll(".loader-node");
        nodes.forEach((node) => {
          (node as HTMLElement).style.transform = `translate(-50%, -50%) scale(1) rotate(${-degrees}deg)`;
        });
        requestAnimationFrame(counterRotate);
      }
      requestAnimationFrame(counterRotate);
    }

    // Dismiss loader after cinematic sequence
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, dismissDelay);

    const timer2 = setTimeout(() => {
      setDismissed(true);
    }, dismissDelay + 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`loader-screen ${fadeOut ? "fade-out" : ""}`}
      aria-hidden="true"
    >
      {/* Ambient background particles */}
      <div className="loader-bg-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="loader-particle" />
        ))}
      </div>

      {/* Radial glow */}
      <div className="loader-glow" />

      <div className="loader-content">
        {/* Constellation */}
        <div className="loader-constellation">
          {/* Orbit rings */}
          <svg
            className="loader-orbit-rings"
            viewBox="0 0 600 600"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="orbit-ring orbit-ring--inner"
              cx="300"
              cy="300"
              r="120"
              stroke="currentColor"
            />
            <circle
              className="orbit-ring orbit-ring--outer"
              cx="300"
              cy="300"
              r="200"
              stroke="currentColor"
            />
            <circle
              className="orbit-ring orbit-ring--glow"
              cx="300"
              cy="300"
              r="160"
              stroke="currentColor"
            />
          </svg>

          {/* Centre wordmark */}
          <div className="loader-center">
            <div className="loader-center-ring" />
            <span className="loader-center-text">
              Your
              <br />
              Village
            </span>
          </div>

          {/* Orbiting nodes */}
          <div className="loader-orbit" ref={orbitRef}>
            {SERVICE_NODES.map((node, i) => (
              <div key={i} className="loader-node" data-index={i}>
                <div className="loader-node-dot" />
                <div className="loader-node-pulse" aria-hidden="true" />
                <span className="loader-node-label">{node.label}</span>
              </div>
            ))}
          </div>

          {/* Connector lines */}
          <svg
            className="loader-connectors"
            viewBox="0 0 600 600"
            fill="none"
            aria-hidden="true"
          >
            {CONNECTORS.map((c, i) => (
              <line
                key={i}
                className="loader-connector"
                data-index={i}
                x1="300"
                y1="300"
                x2={c.x2}
                y2={c.y2}
                stroke="currentColor"
              />
            ))}
          </svg>
        </div>

        {/* Tagline */}
        <p className="loader-tagline">
          The support system every new parent deserves
        </p>
      </div>
    </div>
  );
}
