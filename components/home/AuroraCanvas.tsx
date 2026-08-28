"use client";

import { useEffect, useRef } from "react";

// Soft colour palette — sage greens + warm gold
const ORBS = [
  { cx: 0.15, cy: 0.25, r: 0.38, rgb: [139, 158, 124], a: 0.5, speed: 0.0003, phase: 0 },
  { cx: 0.8, cy: 0.15, r: 0.34, rgb: [214, 184, 138], a: 0.46, speed: 0.0004, phase: 2 },
  { cx: 0.5, cy: 0.62, r: 0.44, rgb: [139, 158, 124], a: 0.38, speed: 0.00025, phase: 4 },
  { cx: 0.35, cy: 0.08, r: 0.27, rgb: [168, 184, 156], a: 0.44, speed: 0.00035, phase: 1 },
  { cx: 0.7, cy: 0.55, r: 0.3, rgb: [205, 170, 125], a: 0.32, speed: 0.00045, phase: 3 },
  { cx: 0.05, cy: 0.75, r: 0.26, rgb: [196, 178, 140], a: 0.28, speed: 0.0005, phase: 5 },
];

const FPS = 30;

/**
 * Performance notes: each orb's radial gradient is rendered ONCE to an
 * offscreen sprite, and animation frames just drawImage at drifted
 * offsets — far cheaper than re-building gradients per frame. The loop
 * runs at a capped 30fps, pauses when the canvas leaves the viewport or
 * the tab hides, and on small screens (or reduced motion) we draw a
 * single static frame with no loop at all.
 */
export default function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.matchMedia("(max-width: 768px)").matches;
    const animate = !reduceMotion && !isSmall;

    let w = 0;
    let h = 0;
    let sprites: { img: HTMLCanvasElement; size: number }[] = [];

    const buildSprites = () => {
      sprites = ORBS.map((orb) => {
        const size = Math.max(64, Math.round(orb.r * Math.max(w, h) * 2));
        const off = document.createElement("canvas");
        off.width = off.height = size;
        const octx = off.getContext("2d")!;
        const [r, g, b] = orb.rgb;
        const grad = octx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${orb.a})`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${orb.a * 0.4})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        octx.fillStyle = grad;
        octx.fillRect(0, 0, size, size);
        return { img: off, size };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildSprites();
    };

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ORBS.forEach((orb, i) => {
        const dx = Math.sin(t * orb.speed + orb.phase) * w * 0.06;
        const dy = Math.cos(t * orb.speed * 0.7 + orb.phase + 1) * h * 0.05;
        const { img, size } = sprites[i];
        ctx.drawImage(img, orb.cx * w + dx - size / 2, orb.cy * h + dy - size / 2);
      });
    };

    resize();
    drawFrame(0);

    if (!animate) {
      const onResize = () => { resize(); drawFrame(0); };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let rafId = 0;
    let running = false;
    let visible = true;
    let last = 0;
    const interval = 1000 / FPS;

    const loop = (now: number) => {
      if (!running) return;
      if (now - last >= interval) {
        last = now;
        drawFrame(now);
      }
      rafId = requestAnimationFrame(loop);
    };

    const setRunning = (on: boolean) => {
      if (on === running) return;
      running = on;
      if (on) rafId = requestAnimationFrame(loop);
      else cancelAnimationFrame(rafId);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      setRunning(visible && document.visibilityState === "visible");
    });
    io.observe(canvas);

    const onVis = () => setRunning(visible && document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      setRunning(false);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}
