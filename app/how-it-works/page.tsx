import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how Your Village brings together postpartum support — from your first conversation to ongoing care.",
};

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "A quick conversation about your situation. No forms to fill, no pressure. Just tell us what\u2019s hard.",
    cta: { label: "Start here", href: "/get-started" },
  },
  {
    number: "02",
    title: "We build your village",
    description:
      "We curate the right providers from our vetted network and organise everything — schedules, logistics, introductions.",
  },
  {
    number: "03",
    title: "Support arrives",
    description:
      "Meals, care, help — thoughtfully curated and ongoing. Your team stays with you, adjusting as your needs change.",
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
            Three steps. Zero stress.
          </h1>
          <p className="text-text-muted max-w-xl mx-auto leading-relaxed">
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

      {/* Your team section */}
      <section className="bg-surface py-16 md:py-20">
        <Container narrow>
          <ScrollReveal>
            <div className="text-center">
              <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
                Your team
              </p>
              <h2 className="text-h2 font-heading mb-6">
                People who know your story.
              </h2>
              <p className="text-text-body leading-relaxed mb-10 max-w-2xl mx-auto">
                Not a call centre. A team who takes the time to understand your
                family and what kind of help would actually make a difference.
                They stay with you as long as you need — and adjust as things
                change.
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
