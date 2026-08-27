"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

// The "they get me" moment. A new parent should read these lines and
// feel recognised before we say a single word about ourselves.
const thoughts = [
  "Too tired to google, let alone compare.",
  "Everyone says ‘ask for help’. Nobody says who.",
  "Fourteen open tabs, and still no plan.",
  "The washing, the meals, the appointments — and a baby.",
];

export default function EmpathySection() {
  return (
    <section className="bg-surface py-32 md:py-40 lg:py-48">
      <Container narrow>
        <ScrollReveal>
          <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-sage mb-5 font-body text-center">
            If this is you right now
          </p>
          <h2 className="text-h2 font-heading text-center mb-16 md:mb-20 max-w-xl mx-auto">
            It&apos;s 3am and you&apos;re holding everything.
          </h2>
        </ScrollReveal>

        <div className="space-y-7 md:space-y-8 max-w-md mx-auto mb-16 md:mb-20">
          {thoughts.map((line, i) => (
            <ScrollReveal key={line} stagger={i + 1}>
              <p
                className={`font-heading italic text-[1.35rem] md:text-[1.5rem] leading-snug text-text-body/80 ${
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
            <div className="w-16 h-px mx-auto mb-10 bg-gradient-to-r from-transparent via-sage/40 to-transparent" />
            <p className="text-body-lg text-text-primary font-medium max-w-md mx-auto leading-relaxed">
              You&apos;re not doing it wrong.
              <br />
              You&apos;re doing it without a village.
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
