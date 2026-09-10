import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AuroraCanvas from "./AuroraCanvas";
import { services } from "@/content/services";

const preview = ["food", "postpartum-carers", "counselling", "cleaning"].map(
  (slug) => services.find((s) => s.slug === slug)!,
);

export default function Hero() {
  return (
    <section className="grain relative overflow-hidden pt-28 pb-14 md:pt-40 md:pb-24">
      <AuroraCanvas />
      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <p className="hero-reveal hero-reveal-1 text-eyebrow uppercase tracking-[0.2em] font-semibold text-text-sage mb-5">
              For mothers. For families. For you.
            </p>
            <h1 className="hero-reveal hero-reveal-2 font-heading text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.04] tracking-[-0.035em] mb-6">
              Life takes
              <br />a village.
              <br />
              <span className="text-text-sage">Find your people.</span>
            </h1>
            <p className="hero-reveal hero-reveal-3 text-base md:text-body-lg text-text-body max-w-lg mb-7 leading-relaxed">
              Food on the table. An extra pair of hands. Someone to talk to.
              Bring together the support you need, for the life you&apos;re
              living now.
            </p>
            <div className="hero-reveal hero-reveal-4 flex flex-wrap gap-3">
              <Button href="/services">
                Explore support <span aria-hidden="true">→</span>
              </Button>
              <Button href="/get-started" variant="secondary">
                Build my village
              </Button>
            </div>
            <p className="mt-5 text-sm text-text-muted">
              Already have support? There&apos;s room for a little more.
            </p>
          </div>
          <div className="hero-reveal hero-reveal-3 rounded-[var(--radius-xl)] border border-white/80 bg-background/90 p-6 md:p-8 shadow-premium">
            <div className="flex items-center gap-3 border-b border-border pb-5 mb-5">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-deep text-white text-xl"
              >
                ◎
              </span>
              <div>
                <p className="font-heading text-2xl text-text-primary">
                  You, at the centre.
                </p>
                <p className="text-xs text-text-muted">
                  A village shaped around your needs.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {preview.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex items-center gap-4 rounded-[var(--radius-md)] bg-elevated p-4 border border-border-subtle hover:border-sage transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="h-9 w-9 shrink-0 p-2 rounded-full bg-sage/10 text-text-sage"
                    dangerouslySetInnerHTML={{ __html: service.icon }}
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-text-primary">
                      {service.title}
                    </span>
                    <span className="block text-xs text-text-muted mt-0.5">
                      {service.tagline}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-text-sage">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/services"
              className="inline-block text-sm text-text-sage underline underline-offset-4 mt-5"
            >
              Explore all kinds of support →
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-text-body/10 mt-12 pt-5 text-xs md:text-sm text-text-muted">
          <span>Every stage of family life</span>
          <span>Practical help and personal wellbeing</span>
          <span>Taking shape in inner Melbourne</span>
        </div>
      </Container>
    </section>
  );
}
