"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { services, highlightedServices } from "@/content/services";

export default function ServicesPreview() {
  const featured = services.filter((s) => highlightedServices.includes(s.slug));

  return (
    <section className="py-24 md:py-32 lg:py-40">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              What we coordinate
            </p>
            <h2 className="text-h2 font-heading">
              Support that covers what matters.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {featured.map((service, i) => (
            <ScrollReveal key={service.slug} stagger={i + 1}>
              <div className="p-8 md:p-10 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                <div
                  className="w-10 h-10 text-sage mb-5"
                  dangerouslySetInnerHTML={{ __html: service.icon }}
                />
                <h3 className="text-h3 font-heading mb-2 group-hover:text-sage transition-colors">
                  {service.title}
                </h3>
                <p className="text-text-muted leading-relaxed text-sm">
                  {service.tagline}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sage font-medium hover:text-sage-dark transition-colors"
            >
              View all services
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
