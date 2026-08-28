import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

// The honest pre-launch device that lives where testimonials will one
// day go. Zero clients served — so we say exactly that, and make being
// early the offer.
export default function FoundingFamiliesSection() {
  return (
    <section className="py-20 md:py-24 lg:py-28">
      <Container narrow>
        <ScrollReveal>
          <div className="relative p-8 md:p-12 rounded-[var(--radius-xl)] border border-sage/30 bg-gradient-to-br from-sage/[0.07] via-elevated to-warm/[0.05] text-center overflow-hidden">
            <svg viewBox="0 0 64 64" width="30" height="30" fill="none" aria-hidden="true" className="mx-auto mb-5 text-sage">
              <circle cx="32" cy="10" r="5.5" fill="currentColor" opacity="0.85" />
              <circle cx="51" cy="21" r="5.5" fill="currentColor" opacity="0.75" />
              <circle cx="51" cy="43" r="5.5" fill="currentColor" opacity="0.65" />
              <circle cx="32" cy="54" r="5.5" fill="currentColor" opacity="0.8" />
              <circle cx="13" cy="43" r="5.5" fill="currentColor" opacity="0.7" />
              <circle cx="13" cy="21" r="5.5" fill="currentColor" opacity="0.78" />
            </svg>
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-text-sage mb-4 font-body">
              We&apos;re building the first village
            </p>
            <h2 className="text-h2 font-heading mb-6 max-w-md mx-auto">
              Your Village opens with ten founding families.
            </h2>
            <p className="text-text-body leading-[1.8] max-w-lg mx-auto mb-4">
              We&apos;re starting deliberately small: a founding group of ten
              inner-Melbourne families. Founding families get our fullest
              attention{/* TODO(mario): name the concrete founding benefit — e.g. founding rate, locked pricing, priority access */}{" "}
              and help shape what this becomes.
            </p>
            <p className="text-text-primary font-medium mb-9 max-w-md mx-auto">
              We&apos;d rather do ten families properly than a hundred badly.
            </p>
            <Button href="/get-started?ref=founding" size="lg">
              Apply to be a founding family
              <span aria-hidden="true">&rarr;</span>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
