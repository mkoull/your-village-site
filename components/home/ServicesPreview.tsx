"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { services } from "@/content/services";

export default function ServicesPreview() {
  return (
    <section className="bg-surface py-32 md:py-40 lg:py-52">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-20 md:mb-24">
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-sage mb-5 font-body">
              What&apos;s in a village
            </p>
            <h2 className="text-h2 font-heading max-w-xl mx-auto">
              Every kind of help, one front door.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {services.map((service, i) => (
            <ScrollReveal key={service.slug} stagger={(i % 4) + 1}>
              <Link
                href={`/services/${service.slug}`}
                className="block h-full p-7 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div
                  className="w-9 h-9 text-sage mb-4"
                  dangerouslySetInnerHTML={{ __html: service.icon }}
                />
                <h3 className="font-heading text-[1.1rem] mb-1.5 group-hover:text-sage transition-colors">
                  {service.title}
                </h3>
                <p className="text-text-muted leading-relaxed text-sm">
                  {service.tagline}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <Button href="/services" variant="secondary">
              Explore all services
              <span aria-hidden="true">&rarr;</span>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
