"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

// The "they get me" moment, set at the hour it describes. The page goes
// dark like the room she's sitting in — then hands her the reframe.
const thoughts = [
  "Too tired to google, let alone compare.",
  "Everyone says ‘ask for help’. Nobody says who.",
  "Fourteen open tabs, and still no plan.",
  "The washing, the meals, the appointments — and a baby.",
];

export default function EmpathySection() {
  return (
    <section className="night-sky relative overflow-hidden py-32 md:py-40 lg:py-48">
      {/* Star field + moon glow, pure CSS */}
      <div className="night-stars" aria-hidden="true" />
      <div className="night-moon" aria-hidden="true" />

      <Container narrow className="relative z-10">
        <ScrollReveal>
          <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-sage-light mb-5 font-body text-center">
            If this is you right now
          </p>
          <h2 className="text-h2 font-heading text-white text-center mb-16 md:mb-20 max-w-xl mx-auto">
            It&apos;s 3am and you&apos;re holding everything.
          </h2>
        </ScrollReveal>

        <div className="space-y-8 md:space-y-10 max-w-md mx-auto mb-16 md:mb-20">
          {thoughts.map((line, i) => (
            <ScrollReveal key={line} stagger={i + 1}>
              <p
                className={`font-heading italic text-[1.35rem] md:text-[1.55rem] leading-snug text-white/55 ${
                  i % 2 === 0 ? "text-left" : "text-right"
                }`}
              >
                {line}
              </p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <div className="w-16 h-px mx-auto mb-10 bg-gradient-to-r from-transparent via-sage/60 to-transparent" />
            <p className="text-body-lg text-white font-medium max-w-md mx-auto leading-relaxed">
              You&apos;re not doing it wrong.
              <br />
              <span className="text-sage-light">You&apos;re doing it without a village.</span>
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
