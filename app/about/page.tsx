import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Your Village exists — the story behind our postpartum support coordination service.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-32">
      {/* Hero */}
      <section className="pb-16 md:pb-24">
        <Container narrow className="text-center">
          <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
            Our story
          </p>
          <h1 className="text-h1 font-heading">
            Why Your Village exists.
          </h1>
        </Container>
      </section>

      {/* Founder story */}
      <section className="pb-24 md:pb-32">
        <Container narrow>
          <ScrollReveal>
            <div className="space-y-6 text-text-body leading-relaxed">
              <p>
                I watched someone I love go through the first weeks with a new
                baby — no family nearby, no plan, and no idea where to start
                finding help. She&apos;s one of the most capable people I know —
                and none of that mattered. She was exhausted, overwhelmed, and
                trying to do something she&apos;d never done before while
                recovering from something her body had never done before.
              </p>

              <p>
                The help existed. Doulas, lactation consultants, meal services,
                sleep specialists — they were all out there, often just a few
                suburbs away. But finding them, vetting them, working out who was
                right, booking them, coordinating their schedules — all of that
                fell on the person who had the least capacity to do it.
              </p>

              <p>
                Your Village is the thing I wished had existed for her. A real
                person who already knows the providers, who listens to what
                you&apos;re going through, and who puts the right support in
                place — so you don&apos;t have to figure it out alone.
              </p>

              <p className="text-text-muted italic text-right mt-8">
                — The founder of Your Village
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* What we are / aren't */}
      <section className="bg-surface py-24 md:py-32">
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
      <section className="py-24 md:py-32">
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
