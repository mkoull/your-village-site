"use client";

import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import AuroraCanvas from "@/components/home/AuroraCanvas";
import { trackEvent } from "@/lib/analytics";
import { getAnonId } from "@/lib/anon";
import { submitLead } from "@/lib/leads";

// Question 1 of the assessment, embedded where everyone lands.
// Selecting an answer starts the quiz with it pre-filled.
const stageOptions = [
  { label: "We're expecting", value: "expecting" },
  { label: "Newborn (0–3 months)", value: "newborn" },
  { label: "Baby (3–12 months)", value: "baby" },
  { label: "Somewhere else entirely", value: "other" },
];

export default function Hero() {
  const router = useRouter();

  const startQuiz = (value: string) => {
    trackEvent("quiz_started", { stage: value, from: "hero" });
    void submitLead("quiz_step", {
      anonId: getAnonId(),
      step: 0,
      field: "stage",
      value,
      from: "hero",
    });
    router.push(`/get-started?stage=${value}`);
  };

  return (
    <section className="grain relative min-h-[100dvh] flex items-center justify-center pt-24 pb-24 overflow-hidden">
      {/* Animated aurora canvas background */}
      <AuroraCanvas />

      <Container className="relative z-10 text-center max-w-4xl">
        <p className="hero-reveal hero-reveal-1 text-eyebrow uppercase tracking-[0.25em] font-semibold text-text-sage mb-7 font-body">
          Postpartum support &middot; Inner Melbourne
        </p>

        <h1 className="hero-reveal hero-reveal-2 text-display font-heading font-normal leading-[1.05] mb-8 tracking-[-0.03em]">
          It takes a village.
          <br />
          <em className="hero-gradient-text font-light not-italic">We build yours.</em>
        </h1>

        <p className="hero-reveal hero-reveal-3 text-body-lg text-text-body max-w-xl mx-auto mb-12 leading-[1.75]">
          One conversation, and we organise the meals, the overnight carer,
          the sleep consultant, the cleaner &mdash; booked, scheduled and
          checked on. Vetted providers across inner Melbourne. The first
          conversation is free.
        </p>

        {/* Quiz question 1, right here */}
        <div className="hero-reveal hero-reveal-4 max-w-lg mx-auto">
          <p className="font-heading text-[1.3rem] md:text-[1.45rem] text-text-primary mb-5">
            Where are you at?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => startQuiz(option.value)}
                className="p-4 rounded-[var(--radius-md)] border border-border bg-elevated/80 backdrop-blur-sm text-left font-medium text-[15px] text-text-body cursor-pointer transition-all duration-200 hover:border-sage hover:text-sage hover:shadow-md hover:-translate-y-0.5"
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm text-text-muted">
            Three more questions, then we sketch your starting village.
            Free, no commitment.
          </p>
        </div>
      </Container>

      {/* Scroll indicator */}
      <div className="hero-reveal hero-reveal-5 absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 hidden md:flex">
        <span className="text-[0.6rem] uppercase tracking-[0.25em] text-text-muted/70 font-body">Scroll</span>
        <div className="w-px h-10 bg-text-muted/25 hero-scroll-line" />
      </div>
    </section>
  );
}
