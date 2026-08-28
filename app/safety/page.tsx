import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Safety & Vetting",
  description:
    "How every Your Village provider is checked before they join: Working with Children Check, national police check, verified qualifications, insurance, references, and a conversation with us.",
};

// Each line of the homepage vetting checklist, substantiated.
const checks = [
  {
    title: "Working with Children Check",
    body: "Every provider holds a current Victorian Working with Children Check. We sight the card, verify it against the register, and record the expiry so it never silently lapses.",
  },
  {
    title: "National police check",
    body: "A nationally coordinated criminal history check, no older than 12 months when a provider joins, renewed on a rolling basis.",
  },
  {
    title: "Qualifications verified",
    body: "Where a role carries a qualification — IBCLC lactation consultants, perinatal psychologists and counsellors, maternity-experienced carers — we verify the credential with the issuing body, not just the CV.",
  },
  {
    title: "Insurance confirmed",
    body: "Providers carry current professional indemnity and public liability insurance appropriate to their work, and we sight the certificates of currency.",
  },
  {
    title: "Reference-checked by us",
    body: "We speak to real past clients or employers ourselves — actual phone calls, not a form. We ask the question that matters: would you have this person back in your home with your newborn?",
  },
  {
    title: "A conversation with every provider",
    body: "Nobody joins the village off paperwork alone. We meet every provider and talk about how they work in a postpartum home — gentleness, judgement-free care, and respect for how vulnerable this season is. If we wouldn't send them to someone we love, they're not in.",
  },
];

export default function SafetyPage() {
  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20">
      <Container narrow>
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-text-sage mb-4 font-body">
              Safety &amp; vetting
            </p>
            <h1 className="text-h1 font-heading mb-4">
              Who we let near your family.
            </h1>
            <p className="text-text-body max-w-lg mx-auto leading-[1.8]">
              Trusting a stranger with your newborn is the highest bar there
              is. This is exactly what every provider clears before they can
              join the village — every line, every time.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4 mb-12">
          {checks.map((check, i) => (
            <ScrollReveal key={check.title} stagger={(i % 3) + 1}>
              <div className="flex items-start gap-4 p-6 md:p-7 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm">
                <div className="w-8 h-8 shrink-0 rounded-full bg-sage/10 text-sage flex items-center justify-center mt-0.5">
                  <svg className="w-4.5 h-4.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-[1.2rem] mb-1.5">{check.title}</h2>
                  <p className="text-text-body leading-[1.75] text-[15px]">{check.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="p-6 md:p-7 rounded-[var(--radius-lg)] bg-surface border border-border-subtle mb-12">
            <h2 className="font-heading text-[1.2rem] mb-1.5">And if something ever feels off</h2>
            <p className="text-text-body leading-[1.75] text-[15px]">
              Tell us — one message, no awkward conversation with the
              provider. We take it from there, rematch you, and follow up on
              what happened. Your comfort in your own home outranks
              everything else.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="text-center">
            <Button href="/get-started" size="lg">
              Start the free conversation
              <span aria-hidden="true">&rarr;</span>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </div>
  );
}
