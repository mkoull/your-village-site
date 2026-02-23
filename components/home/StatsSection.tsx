"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const stats = [
  { value: "500+", label: "Hours of support delivered", note: "Launching target" },
  { value: "40+", label: "Providers in our network", note: "And growing" },
  { value: "150+", label: "Parents supported", note: "Early milestone" },
  { value: "<4h", label: "Average response time", note: "Our commitment" },
];

export default function StatsSection() {
  return (
    <section className="py-[var(--spacing-section)]">
      <Container>
        <ScrollReveal>
          <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage text-center mb-4 font-body">
            Building momentum
          </p>
          <h2 className="text-h2 font-heading text-center mb-16 max-w-2xl mx-auto">
            Our early numbers
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} stagger={i + 1}>
              <div className="stat-panel">
                <p className="text-h1 font-heading font-normal text-sage mb-2">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-text-primary mb-1">
                  {stat.label}
                </p>
                <p className="text-xs text-text-muted">{stat.note}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
