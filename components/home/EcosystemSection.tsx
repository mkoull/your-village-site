"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const steps = [
  {
    number: "1",
    title: "Tell us what\u2019s hard",
    description:
      "A few gentle questions, whenever suits you. No pressure, and nothing to decide yet.",
  },
  {
    number: "2",
    title: "We assemble your village",
    description:
      "We match vetted providers to your family and handle every booking, schedule, and introduction.",
  },
  {
    number: "3",
    title: "Support simply arrives",
    description:
      "Meals, care, rest — coordinated by one team who knows your story, adjusting as your needs change.",
  },
];

export default function EcosystemSection() {
  return (
    <section className="py-32 md:py-40 lg:py-52">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-24 md:mb-32">
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-sage mb-5 font-body">
              How it works
            </p>
            <h2 className="text-h2 font-heading max-w-xl mx-auto">
              Three steps. Then rest.
            </h2>
          </div>
        </ScrollReveal>

        <div className="ecosystem-steps">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} stagger={i + 1}>
              <div className="ecosystem-step">
                <div className="ecosystem-step-indicator">
                  <div className="ecosystem-step-number">{step.number}</div>
                  <div className="ecosystem-step-line" />
                </div>
                <div className="ecosystem-step-content">
                  <h3 className="text-h3 font-heading mb-3">{step.title}</h3>
                  <p className="text-text-muted leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* What actually happens — concrete reassurance near the ask */}
        <ScrollReveal>
          <div className="mt-24 md:mt-28 max-w-2xl mx-auto p-8 md:p-10 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm text-center">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              What happens when you reach out
            </p>
            <p className="text-text-body leading-[1.85] mb-2">
              A real person replies &mdash; usually within a few hours, never
              a bot or a call centre. We listen, then suggest a starting
              point. If it feels right, we begin arranging your village. If
              it doesn&apos;t, no hard feelings.
            </p>
            <p className="text-text-muted text-sm mt-4">
              The first conversation is free, and nothing starts until you
              say so.
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
