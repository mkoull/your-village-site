import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center pt-20 pb-16 overflow-hidden">
      {/* Subtle radial gradient decoration */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-sage-muted) 0%, transparent 70%)",
        }}
      />

      <Container className="relative z-10 text-center max-w-4xl">
        <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-6 font-body">
          Postpartum Support, Coordinated
        </p>

        <h1 className="text-display font-heading font-normal leading-[1.1] mb-8">
          You don&apos;t have to do
          <br />
          <em className="text-sage">this alone.</em>
        </h1>

        <p className="text-body-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Your Village connects you to trusted postpartum support — food, care,
          counselling, cleaning, sleep, lactation, and community — coordinated
          in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button href="/get-started" size="lg">
            Talk to us
            <span aria-hidden="true">&rarr;</span>
          </Button>
          <Button href="/services" variant="secondary" size="lg">
            Explore services
          </Button>
        </div>

        <p className="text-sm text-text-muted">
          No commitment up front. Start with a conversation.
        </p>
      </Container>
    </section>
  );
}
