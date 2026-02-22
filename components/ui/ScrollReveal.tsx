"use client";

import { useScrollReveal } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

export default function ScrollReveal({ children, className, stagger }: ScrollRevealProps) {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "scroll-reveal",
        isRevealed && "revealed",
        stagger ? `stagger-${stagger}` : undefined,
        className
      )}
    >
      {children}
    </div>
  );
}
