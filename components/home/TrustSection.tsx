"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const trustPoints = [
  {
    title: "Every provider vetted",
    description:
      "Background checks, qualifications verified, and personally reviewed before they join the village.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "One team, one story",
    description:
      "You explain your situation once. The same people coordinate everything from there — no repeating yourself.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Privacy-first",
    description:
      "Your information stays between you and your team. We don't sell data or share without consent.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Ongoing, not one-off",
    description:
      "This isn't a referral and a goodbye. Your team stays with you, adjusting support as your needs change.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export default function TrustSection() {
  return (
    <section className="bg-surface py-32 md:py-40 lg:py-52">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-20 md:mb-24">
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-sage mb-5 font-body">
              Who makes it in
            </p>
            <h2 className="text-h2 font-heading max-w-2xl mx-auto">
              If we wouldn&apos;t send them to someone we love, they&apos;re
              not in the village.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((card, i) => (
            <ScrollReveal key={card.title} stagger={i + 1}>
              <div className="h-full p-8 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sage/10 text-sage mb-5">
                  {card.icon}
                </div>
                <h3 className="text-h3 font-heading mb-2">{card.title}</h3>
                <p className="text-text-muted leading-relaxed text-sm">
                  {card.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
