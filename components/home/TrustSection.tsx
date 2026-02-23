"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const trustCards = [
  {
    title: "Every provider vetted",
    description: "Background checks, qualifications verified, and personally reviewed before they join our network.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Clear standards",
    description: "Consistent quality across every service. If we wouldn't recommend them to someone we love, they're not in our network.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: "Privacy-first",
    description: "Your information stays between you and your team. We don't sell data or share without consent.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Ongoing support",
    description: "This isn't a one-off referral. Your team stays with you, adjusting support as your needs change.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M23 6l-9.5 9.5-5-5L1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
];

export default function TrustSection() {
  return (
    <section className="bg-surface py-16 md:py-20 lg:py-24">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              Trust
            </p>
            <h2 className="text-h2 font-heading">
              Trusted providers. Evidence-based care.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {trustCards.map((card, i) => (
            <ScrollReveal key={card.title} stagger={i + 1}>
              <div className="p-8 md:p-10 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm">
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
