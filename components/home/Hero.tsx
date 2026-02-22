import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AuroraCanvas from "@/components/home/AuroraCanvas";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center pt-20 pb-16 overflow-hidden">
      {/* Animated aurora canvas background */}
      <AuroraCanvas />

      <Container className="relative z-10 text-center max-w-4xl">
        <p className="hero-reveal hero-reveal-1 text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-6 font-body">
          Postpartum Support, Coordinated
        </p>

        <h1 className="hero-reveal hero-reveal-2 text-display font-heading font-normal leading-[1.1] mb-8">
          You don&apos;t have to do
          <br />
          <em className="text-sage">this alone.</em>
        </h1>

        <p className="hero-reveal hero-reveal-3 text-body-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Your Village connects you to trusted postpartum support — food, care,
          counselling, cleaning, sleep, lactation, and community — coordinated
          in one place.
        </p>

        <div className="hero-reveal hero-reveal-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button href="/get-started" size="lg">
            Talk to us
            <span aria-hidden="true">&rarr;</span>
          </Button>
          <Button href="/services" variant="secondary" size="lg">
            Explore services
          </Button>
        </div>

        <p className="hero-reveal hero-reveal-5 text-sm text-text-muted">
          No commitment up front. Start with a conversation.
        </p>
      </Container>
    </section>
  );
}
