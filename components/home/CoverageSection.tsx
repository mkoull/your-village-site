import Link from "next/link";
import Container from "@/components/ui/Container";
import { SERVICE_AREAS } from "@/lib/site";
export default function CoverageSection() {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <Container>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.2em] text-text-sage font-semibold mb-4">
              Starting close to home
            </p>
            <h2 className="text-h2 font-heading mb-5">
              Taking shape in
              <br />
              inner Melbourne.
            </h2>
            <p className="text-text-muted">
              These are the areas we&apos;re exploring first. Availability will
              depend on the service and provider.
            </p>
          </div>
          <div>
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
            <p className="text-sm text-text-muted">
              Somewhere else?{" "}
              <Link
                href="/waitlist"
                className="underline text-text-sage underline-offset-4"
              >
                Tell us your suburb →
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
