"use client";

import AddToVillage from "@/components/village/AddToVillage";
import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { services } from "@/content/services";

export default function ServicesPreview() {
  const [selected, setSelected] = useState(services[0].slug);
  const service = services.find((item) => item.slug === selected)!;

  return (
    <section id="explore-support" className="py-16 md:py-24 scroll-mt-20">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 md:mb-12">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-text-sage mb-4">
              The many ways to feel supported
            </p>
            <h2 className="text-h2 font-heading">
              What would help <em className="text-text-sage">today?</em>
            </h2>
          </div>
          <p className="text-sm text-text-muted max-w-xs leading-relaxed">
            You don&apos;t need to have it all figured out. Start with whatever
            is on your mind.
          </p>
        </div>
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
          <div
            className="service-choices"
            role="group"
            aria-label="Choose the support you would like to explore"
          >
            {services.map((item, i) => (
              <button
                key={item.slug}
                type="button"
                aria-pressed={selected === item.slug}
                aria-controls="support-detail"
                onClick={() => setSelected(item.slug)}
                className="service-choice"
              >
                <span aria-hidden="true" className="service-choice-number">
                  0{i + 1}
                </span>
                <span>{item.need}</span>
                <span aria-hidden="true" className="service-choice-arrow">
                  ↗
                </span>
              </button>
            ))}
          </div>
          <p role="status" className="sr-only">
            {service.title} selected. Details follow the support choices.
          </p>
          <div
            id="support-detail"
            role="region"
            aria-label="Selected support"
            className={`service-detail village-tone-${service.tone}`}
          >
            <div className="flex items-start justify-between gap-5 mb-7">
              <div>
                <p className="text-eyebrow uppercase tracking-[0.17em] text-text-sage font-semibold mb-3">
                  {service.title}
                </p>
                <h3 className="font-heading text-[clamp(2rem,3.2vw,2.8rem)] max-w-sm">
                  {service.tagline}
                </h3>
              </div>
              <span
                className="service-detail-icon"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: service.icon }}
              />
            </div>
            <p className="text-sm md:text-base text-text-body leading-relaxed mb-6">
              {service.description}
            </p>
            <ul className="space-y-3 mb-8">
              {service.features.slice(0, 3).map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 items-start text-sm text-text-body"
                >
                  <span aria-hidden="true" className="text-text-sage">
                    ↳
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-auto">
              <Button href={`/services/${service.slug}`}>
                Explore {service.shortTitle.toLowerCase()}{" "}
                <span aria-hidden="true">→</span>
              </Button>
              <AddToVillage slug={service.slug} compact />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 border-t border-border pt-5 text-sm">
          <p className="text-text-muted">
            One kind of help, or a few. It&apos;s your village.
          </p>
          <Link
            href="/services"
            className="text-text-sage underline underline-offset-4 decoration-sage/40"
          >
            See all services <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
