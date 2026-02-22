import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AuroraCanvas from "@/components/home/AuroraCanvas";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 pb-24 overflow-hidden">
      {/* Animated aurora canvas background */}
      <AuroraCanvas />

      <Container className="relative z-10 text-center max-w-4xl">
        <p className="hero-reveal hero-reveal-1 text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-6 font-body">
          Postpartum Support, Coordinated
        </p>

        <h1 className="hero-reveal hero-reveal-2 text-display font-heading font-normal leading-[1.08] mb-8 tracking-tight">
          You don&apos;t have to do
          <br />
          <em className="text-sage font-light">this alone.</em>
        </h1>

        <p className="hero-reveal hero-reveal-3 text-body-lg text-text-muted max-w-lg mx-auto mb-12 leading-relaxed">
          One coordinator. Trusted providers. Meals, care, sleep support,
          and more — organised around your family.
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
          No commitment. Start with a conversation.
        </p>
      </Container>

      {/* Scroll indicator */}
      <div className="hero-reveal hero-reveal-5 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-text-muted font-body">Scroll</span>
        <div className="w-px h-8 bg-text-muted/30 hero-scroll-line" />
      </div>
    </section>
  );
}
