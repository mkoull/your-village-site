"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

const categories = [
  { label: "All", value: "all" },
  { label: "Practical", value: "practical" },
  { label: "Specialist", value: "specialist" },
  { label: "Emotional", value: "emotional" },
  { label: "Community", value: "community" },
];

function ServiceExpandable({ service }: { service: typeof services[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-8 md:p-10 flex items-start gap-5 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <div
          className="w-10 h-10 text-sage shrink-0 mt-0.5"
          dangerouslySetInnerHTML={{ __html: service.icon }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-h3 font-heading group-hover:text-sage transition-colors">
            {service.title}
          </h3>
          <p className="text-text-muted text-sm mt-1">{service.tagline}</p>
        </div>
        <svg
          className={cn(
            "w-5 h-5 text-text-muted shrink-0 mt-1 transition-transform duration-300",
            open && "rotate-180"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="px-8 md:px-10 pb-8 md:pb-10 border-t border-border-subtle pt-6">
          <p className="text-text-body leading-relaxed mb-6">{service.description}</p>
          <p className="text-text-muted leading-relaxed mb-6 text-sm">{service.details}</p>

          <ul className="space-y-2 mb-6">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-text-body">
                <svg className="w-4 h-4 text-sage shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <p className="text-xs text-text-muted mb-6">
            <strong className="text-text-body">Who it&apos;s for:</strong> {service.whoItsFor}
          </p>

          <Button href="/get-started" size="sm">
            Talk to us about {service.title.toLowerCase()}
            <span aria-hidden="true">&rarr;</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? services : services.filter((s) => s.category === filter);

  return (
    <div className="pt-24 md:pt-32">
      {/* Hero */}
      <section className="pb-10 md:pb-16">
        <Container narrow className="text-center">
          <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
            Our services
          </p>
          <h1 className="text-h1 font-heading mb-6">
            Your support, your way.
          </h1>
          <p className="text-text-muted max-w-xl mx-auto leading-relaxed">
            From meals and overnight care to counselling and community.
            Tap any service to learn more.
          </p>
        </Container>
      </section>

      {/* Filter pills */}
      <section className="pb-8">
        <Container>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer",
                  filter === cat.value
                    ? "bg-sage text-white"
                    : "bg-surface text-text-muted hover:text-text-body border border-border"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Service cards */}
      <section className="pb-16 md:pb-20">
        <Container>
          <div className="space-y-4">
            {filtered.map((service) => (
              <ScrollReveal key={service.slug}>
                <ServiceExpandable service={service} />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="bg-surface py-14 md:py-18">
        <Container narrow className="text-center">
          <ScrollReveal>
            <h2 className="text-h2 font-heading mb-4">
              Not sure what you need?
            </h2>
            <p className="text-text-muted mb-8">
              That&apos;s okay. Start with a conversation and we&apos;ll
              figure it out together.
            </p>
            <Button href="/get-started" size="lg">
              Start a conversation
              <span aria-hidden="true">&rarr;</span>
            </Button>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
