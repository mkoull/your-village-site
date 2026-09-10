import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AuroraCanvas from "./AuroraCanvas";
import VillageMap from "./VillageMap";

export default function Hero() {
  return (
    <section className="grain relative overflow-hidden pt-28 pb-7 md:pt-36 md:pb-8">
      <AuroraCanvas />
      <Container className="relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <p className="hero-reveal hero-reveal-1 text-eyebrow uppercase tracking-[0.2em] font-semibold text-text-sage mb-6 flex items-center gap-3">
              <span className="w-5 h-px bg-sage" aria-hidden="true" />A little
              more supported
            </p>
            <h1 className="hero-reveal hero-reveal-2 font-heading text-[clamp(3.4rem,6.4vw,5.5rem)] leading-[1.02] tracking-[-0.045em] mb-6">
              It takes
              <br />a village.
              <br />
              <span className="text-text-sage italic">
                Let&apos;s find yours.
              </span>
            </h1>
            <p className="hero-reveal hero-reveal-3 text-base md:text-lg text-text-body max-w-md mb-8 leading-relaxed">
              A nourishing meal. Time to rest. Someone who gets it. Discover the
              services and people that make family life feel a little lighter.
            </p>
            <div className="hero-reveal hero-reveal-4 flex flex-wrap items-center gap-5">
              <Button href="#explore-support">
                Find your support <span aria-hidden="true">↓</span>
              </Button>
              <Link
                href="/get-started"
                className="text-sm font-medium text-text-sage underline underline-offset-4 decoration-sage/40 py-3"
              >
                Not sure where to start?
              </Link>
            </div>
            <p className="mt-5 text-xs text-text-muted">
              Start with one thing. Build from there.
            </p>
          </div>
          <div className="hero-reveal hero-reveal-3 min-w-0">
            <VillageMap />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-text-body/15 mt-10 md:mt-14 pt-5 text-xs text-text-muted">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-sage-deep"
            />
            Growing in inner Melbourne
          </span>
          <span>Practical help · Expert support · Real connection</span>
        </div>
      </Container>
    </section>
  );
}
