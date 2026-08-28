import Link from "next/link";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ImageSlot from "@/components/ui/ImageSlot";
import { SERVICE_AREAS } from "@/lib/site";

export default function CoverageSection() {
  return (
    <section className="bg-surface py-20 md:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-3">
            <ScrollReveal>
              <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-text-sage mb-4 font-body">
                Where we work
              </p>
              <h2 className="text-h2 font-heading mb-5">
                Inner Melbourne, suburb by suburb.
              </h2>
              <p className="text-text-body leading-[1.8] mb-7 max-w-lg">
                We keep the village local on purpose — it means we know every
                provider personally, and help can actually get to your door.
                Right now that means:
              </p>
              <ul className="flex flex-wrap gap-2.5 mb-7" aria-label="Suburbs we cover">
                {SERVICE_AREAS.map((suburb) => (
                  <li
                    key={suburb}
                    className="px-4 py-2 rounded-full bg-elevated border border-border-subtle text-sm text-text-body"
                  >
                    {suburb}
                  </li>
                ))}
              </ul>
              <p className="text-text-muted text-[15px]">
                Not on the list?{" "}
                <Link
                  href="/contact"
                  className="text-text-sage font-medium underline underline-offset-4 decoration-sage/30 hover:text-sage-dark transition-colors"
                >
                  Ask
                </Link>{" "}
                — we&apos;re expanding suburb by suburb.
              </p>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-2 hidden lg:block">
            <ScrollReveal stagger={2}>
              <ImageSlot label="A Melbourne terrace verandah" ratio="4/3" />
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
