import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AuroraCanvas from "@/components/home/AuroraCanvas";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-24 pb-32 overflow-hidden">
      {/* Animated aurora canvas background */}
      <AuroraCanvas />

      <Container className="relative z-10 text-center max-w-5xl">
        <p className="hero-reveal hero-reveal-1 text-eyebrow uppercase tracking-[0.25em] font-semibold text-sage mb-8 font-body">
          Postpartum Support, Coordinated
        </p>

        <h1 className="hero-reveal hero-reveal-2 text-display font-heading font-normal leading-[1.05] mb-10 tracking-[-0.03em]">
          You don&apos;t have to do
          <br />
          <em className="text-sage font-light not-italic">this alone.</em>
        </h1>

        <p className="hero-reveal hero-reveal-3 text-body-lg text-text-muted max-w-md mx-auto mb-14 leading-[1.8]">
          One coordinator. Trusted providers. Meals, care, sleep support,
          and more — organised around your family.
        </p>

        <div className="hero-reveal hero-reveal-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Button href="/get-started" size="lg">
            Talk to us
            <span aria-hidden="true">&rarr;</span>
          </Button>
          <Button href="/services" variant="secondary" size="lg">
            Explore services
          </Button>
        </div>

        <p className="hero-reveal hero-reveal-5 text-sm text-text-muted/70">
          No commitment. Start with a conversation.
        </p>
      </Container>

      {/* Scroll indicator */}
      <div className="hero-reveal hero-reveal-5 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[0.6rem] uppercase tracking-[0.25em] text-text-muted/50 font-body">Scroll</span>
        <div className="w-px h-10 bg-text-muted/20 hero-scroll-line" />
      </div>
    </section>
  );
}
