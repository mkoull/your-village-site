"use client";

import { useEffect, useRef } from "react";

// Soft colour palette — sage greens + warm gold
const ORBS = [
  { cx: 0.15, cy: 0.25, rx: 0.35, ry: 0.35, r: 139, g: 158, b: 124, a: 0.35, speed: 0.0003, phase: 0 },
  { cx: 0.80, cy: 0.15, rx: 0.30, ry: 0.30, r: 212, g: 190, b: 154, a: 0.30, speed: 0.0004, phase: 2 },
  { cx: 0.50, cy: 0.60, rx: 0.40, ry: 0.40, r: 139, g: 158, b: 124, a: 0.25, speed: 0.00025, phase: 4 },
  { cx: 0.35, cy: 0.10, rx: 0.25, ry: 0.25, r: 168, g: 184, b: 156, a: 0.30, speed: 0.00035, phase: 1 },
  { cx: 0.70, cy: 0.55, rx: 0.28, ry: 0.28, r: 196, g: 178, b: 140, a: 0.20, speed: 0.00045, phase: 3 },
];

export default function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
    };
    motionQuery.addEventListener("change", onMotionChange);

    let rafId: number;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const orb of ORBS) {
        const t = reduceMotion ? 0 : time;

        // Organic drifting — each orb moves in a Lissajous-ish pattern
        const dx = Math.sin(t * orb.speed + orb.phase) * w * 0.06;
        const dy = Math.cos(t * orb.speed * 0.7 + orb.phase + 1) * h * 0.05;

        // Gentle breathing opacity
        const breathe = reduceMotion
          ? 1
          : 0.85 + 0.15 * Math.sin(t * orb.speed * 1.5 + orb.phase);

        const cx = orb.cx * w + dx;
        const cy = orb.cy * h + dy;
        const radius = Math.max(orb.rx * w, orb.ry * h);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(
          0,
          `rgba(${orb.r}, ${orb.g}, ${orb.b}, ${orb.a * breathe})`
        );
        grad.addColorStop(0.5, `rgba(${orb.r}, ${orb.g}, ${orb.b}, ${orb.a * breathe * 0.4})`);
        grad.addColorStop(1, `rgba(${orb.r}, ${orb.g}, ${orb.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
