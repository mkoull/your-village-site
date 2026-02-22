"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Tell us what\u2019s hard",
    description:
      "A quick conversation — no forms, no pressure. Just tell us what you need.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "We build your village",
    description:
      "Your coordinator matches you with vetted providers and handles all the logistics.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Support arrives",
    description:
      "Meals, care, help — coordinated and ongoing. You just rest.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

export default function EcosystemSection() {
  return (
    <section className="bg-surface py-24 md:py-32 lg:py-40">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              How it works
            </p>
            <h2 className="text-h2 font-heading">
              Three steps to feeling supported.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} stagger={i + 1}>
              <div className="text-center p-8 md:p-10 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sage/10 text-sage mb-6">
                  {step.icon}
                </div>
                <p className="text-sm font-semibold text-sage/50 tracking-widest uppercase mb-2 font-body">{step.number}</p>
                <h3 className="text-h3 font-heading mb-3">{step.title}</h3>
                <p className="text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
