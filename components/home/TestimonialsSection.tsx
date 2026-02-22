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
  "Every provider personally vetted",
  "One dedicated coordinator",
  "Privacy-first approach",
  "Ongoing, not one-off",
];

export default function TestimonialsSection() {
  return (
    <section className="bg-surface py-32 md:py-40 lg:py-52">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-24 md:mb-32">
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-sage mb-5 font-body">
              From families we&apos;ve supported
            </p>
            <h2 className="text-h2 font-heading max-w-lg mx-auto">
              Words that keep us going.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24">
          {testimonials.map((testimonial, i) => (
            <ScrollReveal key={i} stagger={i + 1}>
              <blockquote className="testimonial-card">
                <span className="text-sage/20 text-6xl font-heading leading-none mb-4 select-none" aria-hidden="true">&ldquo;</span>
                <p className="text-text-body leading-[1.85] flex-1 mb-10 text-[15px]">
                  {testimonial.quote}
                </p>
                <footer className="text-sm text-text-muted font-medium tracking-wide">
                  {testimonial.attribution}
                </footer>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust signals — minimal, elegant */}
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-3">
            {trustPoints.map((point) => (
              <span
                key={point}
                className="px-5 py-2.5 rounded-full border border-border text-text-muted text-sm font-medium tracking-wide"
              >
                {point}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
