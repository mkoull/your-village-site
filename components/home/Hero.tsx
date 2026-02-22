import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center pt-20 pb-16 overflow-hidden">
      {/* Aurora ambient background — drifting gradient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Orb 1 — large sage, top-left */}
        <div
          className="absolute -top-[10%] -left-[5%] w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 158, 124, 0.4) 0%, transparent 70%)",
            animation: "aurora-drift-1 12s ease-in-out infinite",
          }}
        />
        {/* Orb 2 — warm accent, top-right */}
        <div
          className="absolute -top-[5%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212, 190, 154, 0.35) 0%, transparent 70%)",
            animation: "aurora-drift-2 10s ease-in-out infinite",
          }}
        />
        {/* Orb 3 — large sage, centre-bottom */}
        <div
          className="absolute top-[40%] left-[20%] w-[700px] h-[700px] rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 158, 124, 0.3) 0%, transparent 70%)",
            animation: "aurora-drift-3 14s ease-in-out infinite",
          }}
        />
        {/* Orb 4 — breathing pulse, centre-top */}
        <div
          className="absolute top-[10%] left-[40%] w-[400px] h-[400px] rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 184, 156, 0.35) 0%, transparent 70%)",
            animation: "aurora-breathe 8s ease-in-out infinite",
          }}
        />
      </div>

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
