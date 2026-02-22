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
            Our story.
          </h1>
        </Container>
      </section>

      {/* Founder story */}
      <section className="pb-16 md:pb-20">
        <Container narrow>
          <ScrollReveal>
            <div className="space-y-6 text-text-body leading-relaxed">
              <p>
                When our twins arrived, nothing could have prepared us for what
                came next. Two babies. No sleep. No routine. No family nearby.
                Just an overwhelming blur of feeds, nappies, crying, and the
                constant feeling that we were failing at something we were
                supposed to instinctively know how to do.
              </p>

              <p>
                People told us to &ldquo;ask for help.&rdquo; But ask who? And
                for what, exactly? We didn&apos;t even know what we needed. A
                night nanny? A lactation consultant? A meal service? Someone to
                hold one baby while we fed the other? All of it? We were too
                exhausted to research a single provider, let alone vet them,
                compare them, and coordinate schedules — while running on two
                hours of broken sleep.
              </p>

              <p>
                The help existed. Good people, doing good work, often just a few
                suburbs away. But the gap between knowing help exists and
                actually having it arrive at your door felt impossible to cross
                when you can barely string a sentence together.
              </p>

              <p>
                Your Village is what we wished had existed for us. One person who
                already knows the providers, who listens to what you&apos;re
                going through, and who puts the right support in place — so you
                don&apos;t have to figure it out alone, at the hardest moment of
                your life.
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
              What we are. What we&apos;re not.
            </h2>
            <div className="space-y-6 text-text-body leading-relaxed">
              <p>
                We&apos;re not a marketplace. We&apos;re not a directory.
                We&apos;re not an app that gives you a list and says &ldquo;good
                luck.&rdquo; We&apos;re a coordination layer — a person who sits
                between you and the overwhelming world of postpartum support, and
                makes it simple.
              </p>
              <p>
                Your coordinator knows your story, understands your situation,
                and handles the logistics. You don&apos;t browse providers. You
                don&apos;t compare packages. You tell us what&apos;s hard, and
                we put the right help around you.
              </p>
            </div>
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
            <div className="space-y-6 text-text-body leading-relaxed">
              <p>
                Every provider we work with has been personally vetted — not just
                their qualifications, but how they treat families. We have a
                conversation with every provider before we refer a single family
                to them. We&apos;re looking for warmth, competence, and the kind
                of sensitivity that postpartum families deserve.
              </p>
              <p className="text-text-muted">
                If we wouldn&apos;t recommend them to someone we love,
                they&apos;re not in our network.
              </p>
            </div>
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
