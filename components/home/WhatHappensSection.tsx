import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ImageSlot from "@/components/ui/ImageSlot";

// Concrete nouns only. This section exists to answer "and then what
// happens?" — the question the rest of the site sets up.
const beats = [
  {
    when: "Today",
    what: "You answer four questions, or just send a message. A real person reads it and replies the same day, usually within a few hours.",
  },
  {
    when: "Tomorrow",
    what: "A 20-minute call, or messages if you'd rather not talk. We come back with a specific plan: this many meals, these nights covered, this lactation consultant, this cleaner, this cost.",
  },
  {
    when: "This week",
    what: "You say yes to what you want. We book it, brief every provider so you never re-explain yourself, and send you one schedule. Food starts arriving.",
  },
  {
    when: "Ongoing",
    what: "We check in weekly. Anything can change, pause or stop, any time.",
  },
];

export default function WhatHappensSection() {
  return (
    <section className="py-20 md:py-24 lg:py-28">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-text-sage mb-4 font-body">
              What actually happens
            </p>
            <h2 className="text-h2 font-heading max-w-xl mx-auto">
              From first message to food on the doorstep.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-3">
            <ol className="relative">
              {beats.map((beat, i) => (
                <li key={beat.when} className="relative pl-12 pb-10 last:pb-0">
                  <ScrollReveal stagger={i + 1}>
                    {/* timeline spine */}
                    {i < beats.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[13px] top-8 bottom-0 w-px bg-sage/25"
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-sage-deep text-white text-xs font-semibold font-body flex items-center justify-center shadow-sm"
                    >
                      {i + 1}
                    </span>
                    <h3 className="font-heading text-[1.25rem] text-text-primary mb-1.5">
                      {beat.when}
                    </h3>
                    <p className="text-text-body leading-[1.75] text-[15px] max-w-lg">
                      {beat.what}
                    </p>
                  </ScrollReveal>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-2 hidden lg:block">
            <ScrollReveal stagger={2}>
              <ImageSlot label="A meal handed over at the front door" ratio="3/4" />
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
