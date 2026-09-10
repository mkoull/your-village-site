import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
export default function FoundingFamiliesSection() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="bg-sage/10 rounded-[var(--radius-xl)] p-8 md:p-12 grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.2em] text-text-sage font-semibold mb-4">
              Help build the village
            </p>
            <h2 className="text-h2 font-heading mb-5">
              What would make your life lighter?
            </h2>
            <p className="text-text-body max-w-xl">
              We&apos;re developing Village with the people it&apos;s for.
              Whether you need support, already have some, or offer a service,
              your experience can help shape it.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <Button href="/get-started">Build my village →</Button>
            <Button href="/contact" variant="secondary">
              I offer a service →
            </Button>
            <p className="text-xs text-text-muted">
              Early access enquiries. Bookings are not open yet.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
