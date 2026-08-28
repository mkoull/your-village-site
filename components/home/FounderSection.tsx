import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export default function FounderSection() {
  return (
    <section className="py-32 md:py-40 lg:py-48">
      <Container narrow>
        <ScrollReveal>
          <div className="relative text-center max-w-2xl mx-auto">
            <span
              className="block font-heading text-sage/25 text-[6rem] leading-none select-none mb-2"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <blockquote>
              <p className="font-heading text-[1.5rem] md:text-[1.8rem] leading-[1.5] text-text-primary mb-10">
                When our twins arrived, nothing prepared us for the
                relentlessness of it. The things that actually helped were
                small, specific, and perfectly timed. Your Village is what
                we wished had existed.
              </p>
              <footer className="text-sm text-text-muted font-medium tracking-wide mb-10">
                &mdash; The founders of Your Village, parents of twins
              </footer>
            </blockquote>
            <Button href="/about" variant="secondary" size="sm">
              Read our story
              <span aria-hidden="true">&rarr;</span>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
