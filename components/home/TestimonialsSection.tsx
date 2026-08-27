"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { testimonials } from "@/content/services";

// A deliberately varied trio — different family shapes, different suburbs.
const featured = [testimonials[0], testimonials[3], testimonials[1]];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featured.map((testimonial, i) => (
            <ScrollReveal key={i} stagger={i + 1}>
              <blockquote className="testimonial-card card-shimmer">
                <span className="text-sage/25 text-6xl font-heading leading-none mb-4 select-none" aria-hidden="true">&ldquo;</span>
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
      </Container>
    </section>
  );
}
