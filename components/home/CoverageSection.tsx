import Link from "next/link";
import Container from "@/components/ui/Container";
import { SERVICE_AREAS } from "@/lib/site";
export default function CoverageSection() {
  return (
    <section className="village-coverage py-12 md:py-14 bg-surface">
      <Container>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.2em] text-text-sage font-semibold mb-4">
              Starting close to home
            </p>
            <h2 className="text-3xl md:text-4xl font-heading mb-5">
              Melbourne roots.
              <br />A village that can grow.
            </h2>
            <p className="text-text-muted">
              We’re shaping Village around inner Melbourne first. Each
              independent service sets its own coverage and availability.
            </p>
          </div>
          <div>
            <details className="village-coverage-areas">
              <summary>Areas we’re exploring first</summary>
              <ul
                className="flex flex-wrap gap-2 mb-6"
                aria-label="Proposed launch areas"
              >
                {SERVICE_AREAS.map((suburb) => (
                  <li
                    key={suburb}
                    className="rounded-full border border-border bg-elevated px-4 py-2 text-sm"
                  >
                    {suburb}
                  </li>
                ))}
              </ul>
            </details>
            <p className="text-sm text-text-muted">
              Somewhere else?{" "}
              <Link
                href="/services"
                className="underline text-text-sage underline-offset-4"
              >
                Explore services and check their coverage →
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
