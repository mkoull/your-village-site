import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Our story — how the overwhelming reality of new parenthood led to building Your Village, a postpartum support coordination service in inner Melbourne.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-32">
      {/* Hero */}
      <section className="pb-10 md:pb-16">
        <Container narrow className="text-center">
          <ScrollReveal>
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-sage mb-6 font-body">
              Our story
            </p>
            <h1 className="text-h1 font-heading">
              Built from experience.
            </h1>
          </ScrollReveal>
        </Container>
      </section>

      {/* Founder story */}
      <section className="pb-20 md:pb-28">
        <Container narrow>
          <ScrollReveal>
            <div className="about-story space-y-8 leading-[1.85]">
              <p className="text-text-body text-[1.1rem]">
                When our twins arrived, we had family nearby. We had people
                who loved us. On paper, we had everything we were supposed to
                need.
              </p>

              <p className="text-text-body text-[1.1rem]">
                But nothing prepared us for the relentlessness of it. The
                sleep deprivation that made everything feel impossible. The
                constant feeding. Forgetting to eat ourselves. The strange
                grief of losing the rhythm of who we were before — while
                trying to figure out who we were now.
              </p>

              <p className="text-text-body text-[1.1rem]">
                The things that actually helped weren&apos;t grand gestures.
                They were small, specific, and perfectly timed. A meal that
                arrived without us having to ask. Someone checking in who
                genuinely wanted to hear the honest answer. An overnight
                carer so we could sleep — actually sleep — for the first
                time in weeks.
              </p>

              <p className="text-text-body text-[1.1rem]">
                The help existed. Good people, doing good work, often just a
                few suburbs away. But finding them, vetting them, coordinating
                schedules — on two hours of broken sleep? That gap felt
                impossible to cross.
              </p>

              <p className="text-text-primary font-medium text-[1.15rem]">
                Your Village is what we wished had existed. One person who
                already knows the providers, listens to what you&apos;re going
                through, and puts the right support in place.
              </p>

              <p className="text-text-muted italic text-right mt-12 text-[1.05rem]">
                — The founders of Your Village
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Decorative divider */}
      <div className="flex justify-center">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-sage/40 to-transparent" />
      </div>

      {/* What we are / aren't */}
      <section className="bg-surface py-20 md:py-28">
        <Container narrow>
          <ScrollReveal>
            <h2 className="text-h2 font-heading text-center mb-10">
              Not a marketplace. Not a directory.
            </h2>
            <p className="text-text-body leading-[1.85] text-center max-w-2xl mx-auto text-[1.05rem]">
              We&apos;re a coordination layer — a person who sits between you
              and the overwhelming world of postpartum support, and makes it
              simple. You tell us what&apos;s hard, and we put the right help
              around you.
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* Provider vetting */}
      <section className="py-20 md:py-28">
        <Container narrow>
          <ScrollReveal>
            <h2 className="text-h2 font-heading text-center mb-10">
              How we choose providers.
            </h2>
            <p className="text-text-body leading-[1.85] text-center max-w-2xl mx-auto mb-5 text-[1.05rem]">
              Every provider is personally vetted — not just qualifications, but
              how they treat families. We have a conversation with every single
              one before we refer anyone to them.
            </p>
            <p className="text-text-muted text-center max-w-2xl mx-auto text-[1.05rem]">
              If we wouldn&apos;t recommend them to someone we love,
              they&apos;re not in our network.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="text-center mt-14">
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
