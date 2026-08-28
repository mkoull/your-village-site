import Link from "next/link";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

// The vetting promise as a concrete checklist, not a vibe.
// Every line is substantiated on /safety.
const checklist = [
  "Working with Children Check",
  "National police check",
  "Qualifications verified",
  "Insurance confirmed",
  "Reference-checked by us",
  "A conversation with every provider before they join",
];

const trustPoints = [
  {
    title: "One team, one story",
    description:
      "You explain your situation once. The same people coordinate everything from there — no repeating yourself.",
  },
  {
    title: "Privacy-first",
    description: (
      <>
        Your information stays between you and your team, and is never
        sold. See our{" "}
        <Link href="/privacy" className="text-text-sage underline underline-offset-2">privacy page</Link>.
      </>
    ),
  },
  {
    title: "Ongoing, not one-off",
    description:
      "This isn't a referral and a goodbye. Your team stays with you, adjusting support as your needs change.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-surface py-20 md:py-24 lg:py-28">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-14">
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-text-sage mb-4 font-body">
              Who makes it in
            </p>
            <h2 className="text-h2 font-heading max-w-2xl mx-auto">
              If we wouldn&apos;t send them to someone we love, they&apos;re
              not in the village.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* The checklist — every provider, before they join */}
          <ScrollReveal>
            <div className="p-7 md:p-9 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm h-full">
              <h3 className="text-h3 font-heading mb-5">
                Every provider, before they join
              </h3>
              <ul className="space-y-3.5 mb-7">
                {checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-text-body">
                    <svg
                      className="w-5 h-5 text-sage shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/safety"
                className="inline-flex items-center gap-2 text-text-sage font-medium text-sm hover:text-sage-dark transition-colors"
              >
                How we check each of these
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </ScrollReveal>

          {/* The promises around the checklist */}
          <div className="space-y-5">
            {trustPoints.map((card, i) => (
              <ScrollReveal key={card.title} stagger={i + 1}>
                <div className="p-6 md:p-7 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm">
                  <h3 className="font-heading text-[1.2rem] mb-1.5">{card.title}</h3>
                  <p className="text-text-muted leading-relaxed text-sm">
                    {card.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
