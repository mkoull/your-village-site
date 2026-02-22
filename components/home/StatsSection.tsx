"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { stats } from "@/content/services";

export default function StatsSection() {
  return (
    <section className="py-24 md:py-32 lg:py-40">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              Our commitments
            </p>
            <h2 className="text-h2 font-heading">
              What we promise you.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} stagger={i + 1}>
              <div className="text-center p-8 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm">
                <p className="text-2xl md:text-3xl font-heading font-semibold text-sage mb-2">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-text-primary mb-1 font-body">
                  {stat.label}
                </p>
                <p className="text-xs text-text-muted">{stat.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
