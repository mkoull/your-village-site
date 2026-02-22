"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { testimonials } from "@/content/services";

export default function TestimonialsSection() {
  return (
    <section className="bg-surface py-24 md:py-32 lg:py-40">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              From families
            </p>
            <h2 className="text-h2 font-heading">
              Words from parents we&apos;ve supported.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <ScrollReveal key={i} stagger={Math.min(i + 1, 5)}>
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
      </Container>
    </section>
  );
}
