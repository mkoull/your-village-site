import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import ImageSlot from "@/components/ui/ImageSlot";

// A human face before the ask.
// TODO(mario): supply the founder photograph for the ImageSlot below,
// and the real name(s) for the signature line — currently signed the
// same way as the About page.
export default function FounderSection() {
  return (
    <section className="py-20 md:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-14 items-center max-w-4xl mx-auto">
          <div className="md:col-span-2">
            <ScrollReveal>
              <ImageSlot label="The founders, at home in Melbourne" ratio="3/4" />
            </ScrollReveal>
          </div>
          <div className="md:col-span-3">
            <ScrollReveal stagger={1}>
              <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-text-sage mb-5 font-body">
                Why we built this
              </p>
              <blockquote>
                <p className="font-heading text-[1.4rem] md:text-[1.6rem] leading-[1.5] text-text-primary mb-7">
                  When our twins arrived, nothing prepared us for the
                  relentlessness of it. The things that actually helped were
                  small, specific, and perfectly timed. Your Village is what
                  we wished had existed.
                </p>
                <footer className="text-sm text-text-muted font-medium tracking-wide mb-8">
                  &mdash; The founders of Your Village, parents of twins
                </footer>
              </blockquote>
              <Button href="/about" variant="secondary" size="sm">
                Read our story
                <span aria-hidden="true">&rarr;</span>
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
