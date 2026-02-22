"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

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

export default function VillageHero() {
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        const nodes = orbit.querySelectorAll(".hero-constellation-node");
        nodes.forEach((node) => {
          (node as HTMLElement).style.transform = `translate(-50%, -50%) scale(1) rotate(${-degrees}deg)`;
        });
        requestAnimationFrame(counterRotate);
      }
      requestAnimationFrame(counterRotate);
    }
  }, []);

  return (
    <section className="hero-constellation-section">
      {/* Ambient background particles */}
      <div className="hero-constellation-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="hero-constellation-particle" />
        ))}
      </div>

      {/* Radial glow */}
      <div className="hero-constellation-glow" />

      <Container className="relative z-10">
        <div className="hero-constellation-layout">
          {/* Constellation visual */}
          <div className="hero-constellation-wrapper">
            <div className="hero-constellation">
              {/* Orbit rings */}
              <svg
                className="hero-constellation-rings"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="hero-orbit-ring hero-orbit-ring--inner"
                  cx="300"
                  cy="300"
                  r="120"
                  stroke="currentColor"
                />
                <circle
                  className="hero-orbit-ring hero-orbit-ring--outer"
                  cx="300"
                  cy="300"
                  r="200"
                  stroke="currentColor"
                />
                <circle
                  className="hero-orbit-ring hero-orbit-ring--glow"
                  cx="300"
                  cy="300"
                  r="160"
                  stroke="currentColor"
                />
              </svg>

              {/* Centre wordmark */}
              <div className="hero-constellation-center">
                <div className="hero-constellation-center-ring" />
                <span className="hero-constellation-center-text">
                  Your
                  <br />
                  Village
                </span>
              </div>

              {/* Orbiting nodes */}
              <div className="hero-constellation-orbit" ref={orbitRef}>
                {SERVICE_NODES.map((node, i) => (
                  <div key={i} className="hero-constellation-node" data-index={i}>
                    <div className="hero-constellation-dot" />
                    <div className="hero-constellation-pulse" aria-hidden="true" />
                    <span className="hero-constellation-label">{node.label}</span>
                  </div>
                ))}
              </div>

              {/* Connector lines */}
              <svg
                className="hero-constellation-connectors"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                {CONNECTORS.map((c, i) => (
                  <line
                    key={i}
                    className="hero-constellation-connector"
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

          {/* Text content below constellation */}
          <div className="hero-constellation-text">
            <p className="hero-reveal hero-reveal-1 text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              Postpartum Support, Coordinated
            </p>

            <h1 className="hero-reveal hero-reveal-2 text-display font-heading font-normal leading-[1.1] mb-6">
              You don&apos;t have to do
              <br />
              <em className="text-sage">this alone.</em>
            </h1>

            <p className="hero-reveal hero-reveal-3 text-body-lg text-text-muted max-w-xl mx-auto mb-8 leading-relaxed">
              One coordinator. Trusted providers. Meals, care, sleep support,
              and more — organised around your family.
            </p>

            <div className="hero-reveal hero-reveal-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button href="/get-started" size="lg">
                Talk to us
                <span aria-hidden="true">&rarr;</span>
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                Explore services
              </Button>
            </div>

            <p className="hero-reveal hero-reveal-5 text-sm text-text-muted">
              No commitment. Start with a conversation.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
