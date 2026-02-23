"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/lib/hooks";
import { cn } from "@/lib/utils";

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

export default function ConstellationSection() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isRevealed } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  useEffect(() => {
    if (!isRevealed) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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
        const nodes = orbit.querySelectorAll(".constellation-section-node");
        nodes.forEach((node) => {
          (node as HTMLElement).style.transform = `translate(-50%, -50%) scale(1) rotate(${-degrees}deg)`;
        });
        requestAnimationFrame(counterRotate);
      }
      requestAnimationFrame(counterRotate);
    }
  }, [isRevealed]);

  return (
    <section ref={sectionRef} className="constellation-section py-32 md:py-40 lg:py-52 overflow-hidden">
      <Container className="max-w-6xl">
        <div className="constellation-section-layout">
          {/* Text content — left side on desktop */}
          <div className={cn("constellation-section-text", isRevealed && "revealed")}>
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-sage mb-4 font-body">
              The model
            </p>

            <h2 className="text-h2 font-heading mb-8">
              An ecosystem, not another to-do list.
            </h2>

            <div className="space-y-6 text-text-body leading-relaxed">
              <p className="max-w-lg">
                You don&apos;t need another app, another account, or another
                decision to make. Your Village is a coordination layer — we plug
                trusted providers into your life, managed by someone who already
                knows your situation.
              </p>
              <p className="text-text-muted max-w-lg">
                Think of it as your personal support team, assembled and managed
                for you. Meals, care, counselling, cleaning — flowing to your
                family as you need them.
              </p>
            </div>
          </div>

          {/* Constellation visual — right side on desktop */}
          <div className={cn("constellation-section-visual", isRevealed && "active")}>
            {/* Radial glow */}
            <div className="constellation-section-glow" />

            <div className="constellation-section-constellation">
              {/* Orbit rings */}
              <svg
                className="constellation-section-rings"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="constellation-ring constellation-ring--inner"
                  cx="300"
                  cy="300"
                  r="120"
                  stroke="currentColor"
                />
                <circle
                  className="constellation-ring constellation-ring--outer"
                  cx="300"
                  cy="300"
                  r="200"
                  stroke="currentColor"
                />
                <circle
                  className="constellation-ring constellation-ring--glow"
                  cx="300"
                  cy="300"
                  r="160"
                  stroke="currentColor"
                />
              </svg>

              {/* Centre wordmark */}
              <div className="constellation-section-center">
                <div className="constellation-section-center-ring" />
                <span className="constellation-section-center-text">
                  Your
                  <br />
                  Family
                </span>
              </div>

              {/* Orbiting nodes */}
              <div className="constellation-section-orbit" ref={orbitRef}>
                {SERVICE_NODES.map((node, i) => (
                  <div key={i} className="constellation-section-node" data-index={i}>
                    <div className="constellation-section-dot" />
                    <div className="constellation-section-pulse" aria-hidden="true" />
                    <span className="constellation-section-label">{node.label}</span>
                  </div>
                ))}
              </div>

              {/* Connector lines */}
              <svg
                className="constellation-section-connectors"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                {CONNECTORS.map((c, i) => (
                  <line
                    key={i}
                    className="constellation-section-connector"
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
          </div>
        </div>
      </Container>
    </section>
  );
}
