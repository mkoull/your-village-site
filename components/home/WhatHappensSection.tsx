import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const steps = [
  {
    title: "Start with what you need.",
    body: "A hot meal, better rest, an hour to yourself. Small things are a good place to begin.",
  },
  {
    title: "Explore the possibilities.",
    body: "Get to know the services, specialists and community support that could make a difference.",
  },
  {
    title: "Make it your village.",
    body: "Build a starting point around your needs. Keep the support you love and find what’s missing.",
  },
];

export default function WhatHappensSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.2em] text-text-sage font-semibold mb-4">
              A starting point, not another to-do
            </p>
            <h2 className="text-h2 font-heading mb-6">
              Your village.
              <br />
              <em className="text-text-sage">At your pace.</em>
            </h2>
            <p className="text-text-muted text-sm max-w-sm mb-8">
              A few simple questions can help you see what support might fit. No
              contact details needed to explore.
            </p>
            <Button href="/get-started" variant="secondary">
              Find my starting point <span aria-hidden="true">→</span>
            </Button>
          </div>
          <ol>
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="grid grid-cols-[40px_1fr] gap-5 border-t border-border py-7 first:pt-5"
              >
                <span
                  className="font-heading text-3xl text-text-sage/70"
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-heading text-2xl mb-3">{step.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed max-w-sm">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
