import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how Your Village coordinates postpartum support — from your first conversation to ongoing care.",
};

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "A quick conversation to understand your situation. No forms to fill, no pressure. Just tell us what's hard and we'll listen.",
    cta: { label: "Start here", href: "/get-started" },
  },
  {
    number: "02",
    title: "We build your village",
    description:
      "Your coordinator curates the right providers from our vetted network and organises everything — schedules, logistics, introductions.",
  },
  {
    number: "03",
    title: "Support arrives",
    description:
      "Meals, care, help — coordinated and ongoing. Your coordinator stays with you, adjusting support as your needs change. You just rest.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-24 md:pt-32">
      {/* Hero */}
      <section className="pb-10 md:pb-16">
        <Container narrow className="text-center">
          <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
            The process
          </p>
          <h1 className="text-h1 font-heading mb-6">
            How Your Village works.
          </h1>
          <p className="text-text-muted max-w-xl mx-auto leading-relaxed">
            Three simple steps from feeling overwhelmed to feeling supported.
            We handle the complexity so you don&apos;t have to.
          </p>
        </Container>
      </section>

      {/* Steps */}
      <section className="pb-16 md:pb-20">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} stagger={i + 1}>
                <div className="flex gap-6 md:gap-10 p-8 md:p-10 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm">
                  <span className="text-4xl md:text-5xl font-heading font-light text-sage/30 shrink-0">
                    {step.number}
                  </span>
                  <div>
                    <h2 className="text-h3 font-heading mb-3">{step.title}</h2>
                    <p className="text-text-muted leading-relaxed">
                      {step.description}
                    </p>
                    {step.cta && (
                      <div className="mt-4">
                        <Button href={step.cta.href} size="sm" variant="secondary">
                          {step.cta.label}
                          <span aria-hidden="true">&rarr;</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Ecosystem explanation */}
      <section className="bg-surface py-16 md:py-20">
        <Container narrow>
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-h2 font-heading mb-6">
                The coordination model.
              </h2>
              <p className="text-text-body leading-relaxed mb-6">
                Your Village isn&apos;t a marketplace or a directory. We&apos;re
                a coordination layer — a real person who sits between you and the
                overwhelming world of postpartum support, and makes it simple.
              </p>
              <p className="text-text-muted leading-relaxed">
                Providers plug into our network. Your coordinator knows each one
                personally. When you need support, we don&apos;t give you a list
                — we give you the right person, at the right time, without you
                having to manage anything.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Coordinator section */}
      <section className="py-16 md:py-20">
        <Container narrow>
          <ScrollReveal>
            <div className="text-center">
              <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
                Your coordinator
              </p>
              <h2 className="text-h2 font-heading mb-6">
                One person who knows your story.
              </h2>
              <p className="text-text-body leading-relaxed mb-6">
                Your coordinator isn&apos;t a call centre. They&apos;re someone
                who takes the time to understand your family, your situation,
                and what kind of help would actually make a difference.
              </p>
              <p className="text-text-muted leading-relaxed mb-10">
                They stay with you as long as you need. When things change —
                when the baby starts solids, when you go back to work, when you
                just need a different kind of support — they adjust.
              </p>
              <Button href="/get-started" size="lg">
                Start a conversation
                <span aria-hidden="true">&rarr;</span>
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
