import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Your Village handles your information: what we collect, why, who sees it, and how to have it corrected or deleted.",
};

/*
 * Plain-language privacy page substantiating the site's "privacy-first"
 * claim. TODO(mario): have this reviewed before launch (Australian
 * Privacy Principles apply once operating), and add a real contact
 * email address below.
 */

const sections = [
  {
    title: "What we collect",
    body: "What you tell us: your name, contact details, your answers to our questions (your stage, what feels hard, who's around you, timing), and anything you write in a message. If you start the questions and don't finish, we keep the answers you gave, attached to an anonymous identifier, so we don't ask you to repeat yourself.",
  },
  {
    title: "Why we collect it",
    body: "For exactly one purpose: understanding your situation well enough to plan and coordinate your support, and to contact you about it. We don't use your information for advertising, and we don't add you to a newsletter you didn't ask for.",
  },
  {
    title: "Who sees it",
    body: "Our small coordination team, and — only once you've booked — the specific providers working with your family, who receive only what they need to do their job well (your address for a delivery, feeding notes for a carer). Nothing is shared beyond that without asking you first.",
  },
  {
    title: "What we never do",
    body: "We never sell your information. We never trade it. We never pass it to advertisers or data brokers. Not as a policy position — it simply isn't part of how this business works.",
  },
  {
    title: "Where it lives",
    body: "Form submissions are delivered to our secured lead inbox and operational tools. We use privacy-respecting, cookie-free analytics that count page views and events without tracking you across the web.",
  },
  {
    title: "Your choices",
    body: "Ask us at any time what we hold about you, ask us to correct it, or ask us to delete it — we will, promptly and without fuss. If you booked support, we may need to keep minimal records required for tax and legal purposes.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20">
      <Container narrow>
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-text-sage mb-4 font-body">
              Privacy
            </p>
            <h1 className="text-h1 font-heading mb-4">
              Your story stays yours.
            </h1>
            <p className="text-text-body max-w-lg mx-auto leading-[1.8]">
              You&apos;ll tell us vulnerable things — that&apos;s the nature
              of asking for help in this season. Here&apos;s exactly how we
              treat that, in plain language.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4 mb-12">
          {sections.map((s, i) => (
            <ScrollReveal key={s.title} stagger={(i % 3) + 1}>
              <div className="p-6 md:p-7 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm">
                <h2 className="font-heading text-[1.2rem] mb-1.5">{s.title}</h2>
                <p className="text-text-body leading-[1.75] text-[15px]">{s.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <p className="text-text-muted text-sm text-center leading-relaxed max-w-md mx-auto">
            Questions about any of this, or want your information corrected
            or removed?{" "}
            <Link href="/contact" className="text-text-sage underline underline-offset-2 hover:text-sage-dark">
              Contact us
            </Link>{" "}
            and a real person will sort it out.
          </p>
        </ScrollReveal>
      </Container>
    </div>
  );
}
