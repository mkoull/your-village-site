import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
const steps = [
  {
    title: "Find what would help",
    body: "Explore the kinds of support available, or use a few simple questions to find a starting point.",
  },
  {
    title: "Build your own village",
    body: "Choose one kind of help or several. Your needs, your preferences, your stage of life.",
  },
  {
    title: "Help shape what comes next",
    body: "Village is being built. Tell us what you need so we can develop the right local network.",
  },
];
export default function WhatHappensSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="md:flex justify-between items-end gap-10 mb-10">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.2em] text-text-sage font-semibold mb-4">
              Your village, your way
            </p>
            <h2 className="text-h2 font-heading max-w-xl">
              A little help.
              <br />A whole lot of possibility.
            </h2>
          </div>
          <p className="text-text-muted max-w-sm mt-5">
            Start with what would make life easier. You can explore without
            leaving your contact details.
          </p>
        </div>
        <ol className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="rounded-[var(--radius-lg)] border border-border bg-elevated p-7"
            >
              <span className="text-sm text-text-sage font-semibold">
                0{i + 1}
              </span>
              <h3 className="font-heading text-2xl mt-6 mb-3">{s.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button href="/get-started" variant="secondary">
            Find my starting point →
          </Button>
        </div>
      </Container>
    </section>
  );
}
