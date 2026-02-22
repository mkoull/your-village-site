"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const testimonials = [
  {
    quote:
      "I didn\u2019t realise how much I needed help until someone actually organised it for me. Having meals just arrive \u2014 I cried. It was such a relief.",
    attribution: "New mum, Fitzroy",
  },
  {
    quote:
      "Our coordinator just got it. She listened, didn\u2019t rush us, and within days we had a sleep consultant and a cleaner booked. I finally felt like I could breathe.",
    attribution: "First-time parents, Richmond",
  },
  {
    quote:
      "I was too exhausted to even Google. Having someone say \u2018I\u2019ve got this\u2019 \u2014 that changed everything for us.",
    attribution: "New mum, Brunswick",
  },
];

const trustPoints = [
  {
    label: "Every provider vetted",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "One dedicated coordinator",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Privacy-first approach",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    label: "Ongoing, not one-off",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-surface py-16 md:py-20 lg:py-24">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              From families we&apos;ve supported
            </p>
            <h2 className="text-h2 font-heading">
              Real stories from real parents.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, i) => (
            <ScrollReveal key={i} stagger={i + 1}>
              <blockquote className="p-8 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm h-full flex flex-col">
                <p className="text-text-body leading-relaxed flex-1 mb-6 text-[15px]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="text-sm text-text-muted font-medium">
                  {testimonial.attribution}
                </footer>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust signals — compact row */}
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {trustPoints.map((point) => (
              <div key={point.label} className="flex items-center gap-2.5 text-text-muted">
                <span className="text-sage">{point.icon}</span>
                <span className="text-sm font-medium">{point.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
