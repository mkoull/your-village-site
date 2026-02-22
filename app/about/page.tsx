import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Our story — how the overwhelming reality of raising twins led to building Your Village, a postpartum support coordination service.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-32">
      {/* Hero */}
      <section className="pb-10 md:pb-16">
        <Container narrow className="text-center">
          <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
            Our story
          </p>
          <h1 className="text-h1 font-heading">
            Built from experience.
          </h1>
        </Container>
      </section>

      {/* Founder story */}
      <section className="pb-16 md:pb-20">
        <Container narrow>
          <ScrollReveal>
            <div className="space-y-6 text-text-body leading-relaxed">
              <p className="text-body-lg">
                When our twins arrived, nothing could have prepared us for what
                came next. No sleep. No routine. No family nearby. Just an
                overwhelming blur — and the constant feeling we were failing at
                something we were supposed to instinctively know how to do.
              </p>

              <p>
                People told us to &ldquo;ask for help.&rdquo; But ask who? We
                were too exhausted to research a single provider, let alone vet
                them and coordinate schedules on two hours of broken sleep.
              </p>

              <p>
                The help existed — good people, doing good work, often just a
                few suburbs away. But the gap between knowing help exists and
                actually having it arrive at your door felt impossible to cross.
              </p>

              <p className="text-text-primary font-medium">
                Your Village is what we wished had existed. One person who
                already knows the providers, listens to what you&apos;re going
                through, and puts the right support in place.
              </p>

              <p className="text-text-muted italic text-right mt-8">
                — The founders of Your Village
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* What we are / aren't */}
      <section className="bg-surface py-16 md:py-20">
        <Container narrow>
          <ScrollReveal>
            <h2 className="text-h2 font-heading text-center mb-8">
              Not a marketplace. Not a directory.
            </h2>
            <p className="text-text-body leading-relaxed text-center max-w-2xl mx-auto">
              We&apos;re a coordination layer — a person who sits between you
              and the overwhelming world of postpartum support, and makes it
              simple. You tell us what&apos;s hard, and we put the right help
              around you.
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* Provider vetting */}
      <section className="py-16 md:py-20">
        <Container narrow>
          <ScrollReveal>
            <h2 className="text-h2 font-heading text-center mb-8">
              How we choose providers.
            </h2>
            <p className="text-text-body leading-relaxed text-center max-w-2xl mx-auto mb-4">
              Every provider is personally vetted — not just qualifications, but
              how they treat families. We have a conversation with every single
              one before we refer anyone to them.
            </p>
            <p className="text-text-muted text-center max-w-2xl mx-auto">
              If we wouldn&apos;t recommend them to someone we love,
              they&apos;re not in our network.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="text-center mt-12">
              <Button href="/get-started" size="lg">
                Start a conversation
                <span aria-hidden="true">&rarr;</span>
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
