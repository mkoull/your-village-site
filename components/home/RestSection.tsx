"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function RestSection() {
  return (
    <section className="bg-surface py-16 md:py-20 lg:py-24">
      <Container narrow>
        <ScrollReveal>
          <h2 className="text-h2 font-heading text-center mb-8">
            Rest shouldn&apos;t feel out of reach.
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="space-y-6 text-text-body leading-relaxed text-center max-w-2xl mx-auto">
            <p>
              The early weeks with a new baby are a blur of feeds, nappy changes,
              and broken sleep. The help exists — doulas, meal services, sleep
              consultants, counsellors — but finding them, vetting them, and
              coordinating it all falls on the person with the least capacity to
              do it.
            </p>
            <p className="text-text-muted">
              Your Village is the person who handles all of that for you. One
              coordinator who listens to what you need, knows the right providers,
              and puts support in place — so you can focus on recovery, bonding,
              and rest.
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
