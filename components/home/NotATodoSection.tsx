"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function NotATodoSection() {
  return (
    <section className="bg-surface py-16 md:py-20 lg:py-24">
      <Container narrow>
        <ScrollReveal>
          <div className="text-center mb-8">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              The model
            </p>
            <h2 className="text-h2 font-heading mb-6">
              An ecosystem, not another to-do list.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="space-y-6 text-text-body leading-relaxed text-center max-w-2xl mx-auto">
            <p>
              You don&apos;t need another app, another account, or another
              decision to make. Your Village is a considered collection of
              services — we bring trusted providers into your life, managed by
              someone who already knows your situation.
            </p>
            <p className="text-text-muted">
              Think of it as your personal support team, assembled and managed
              for you. Meals, care, counselling, cleaning — flowing to your
              family as you need them.
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
