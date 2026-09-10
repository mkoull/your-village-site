import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
const values = [
  {
    title: "Clear information",
    body: "Understand what a service offers, who it's for, and what to ask before choosing.",
  },
  {
    title: "Your choice",
    body: "Build around support you already have. Add one thing, or explore a different mix.",
  },
  {
    title: "Care with trust in mind",
    body: "Provider checks and clear credentials are part of the network we're building.",
  },
];
export default function TrustSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <p className="text-eyebrow uppercase tracking-[0.2em] text-text-sage font-semibold mb-4">
          Built around people
        </p>
        <h2 className="text-h2 font-heading max-w-xl mb-10">
          Support should feel like support.
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {values.map((v) => (
            <div key={v.title} className="border-t border-border pt-6">
              <h3 className="font-heading text-2xl mb-3">{v.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {v.body}
              </p>
            </div>
          ))}
        </div>
        <Button href="/safety" variant="secondary" size="sm">
          Our approach to trust →
        </Button>
      </Container>
    </section>
  );
}
