import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { services } from "@/content/services";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "How Your Village pricing works: a free first conversation, exact costs approved before anything is booked, no lock-ins. Postpartum support, inner Melbourne.",
};

/*
 * Pricing publishes the STRUCTURE honestly before final numbers exist.
 * TODO(mario): three business decisions are needed to finish this page —
 *   1. The commercial model: coordination fee vs margin on provider
 *      rates (the "how we make money" section states both candidly and
 *      commits to transparency; pick one and tighten the copy).
 *   2. Typical first-fortnight ranges per service (grid below carries
 *      clearly-labelled "range being finalised" placeholders, never
 *      invented numbers).
 *   3. The founding-family rate, if any.
 */

const promises = [
  {
    title: "The first conversation is free",
    body: "The call or message exchange where we understand your situation and sketch your plan costs nothing, and comes with no obligation. You'll leave it knowing exactly what your village would cost before anything begins.",
  },
  {
    title: "You approve every cost before it's booked",
    body: "Your plan lists each piece of support with its exact price. Nothing is booked, and nothing is charged, until you say yes to it — line by line if you like.",
  },
  {
    title: "No lock-ins, ever",
    body: "No subscription, no minimum term. Pause, change or stop any part of your village at any time. You pay for what's delivered.",
  },
  {
    title: "One bill, no surprise line items",
    body: "You pay Your Village, we pay the providers. Coordination is part of the price you approve up front — there are no fees that appear later.",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20">
      <PricingClient />
      <Container narrow>
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-text-sage mb-4 font-body">
              Pricing
            </p>
            <h1 className="text-h1 font-heading mb-4">
              Clear before it costs you anything.
            </h1>
            <p className="text-text-body max-w-lg mx-auto leading-[1.8]">
              Every family&apos;s village is different, so there&apos;s no
              single price — but the way the money works is the same for
              everyone, and you&apos;ll know your exact numbers before
              anything starts.
            </p>
          </div>
        </ScrollReveal>

        {/* How the money works */}
        <div className="space-y-4 mb-14">
          {promises.map((p, i) => (
            <ScrollReveal key={p.title} stagger={(i % 4) + 1}>
              <div className="p-6 md:p-7 rounded-[var(--radius-lg)] bg-elevated border border-border-subtle shadow-sm">
                <h2 className="font-heading text-[1.2rem] mb-1.5">{p.title}</h2>
                <p className="text-text-body leading-[1.75] text-[15px]">{p.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Per-service guide */}
        <ScrollReveal>
          <h2 className="text-h2 font-heading text-center mb-3">
            What&apos;s in a typical first fortnight
          </h2>
          <p className="text-text-muted text-center text-[15px] mb-10 max-w-lg mx-auto">
            We&apos;re finalising exact rates with our founding families, so
            we won&apos;t print numbers we might have to walk back. Here&apos;s
            what a first booking usually looks like — your free conversation
            puts real figures on each line.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {services.map((service, i) => (
            <ScrollReveal key={service.slug} stagger={(i % 4) + 1}>
              <Link
                href={`/services/${service.slug}`}
                className="block h-full p-5 rounded-[var(--radius-md)] bg-elevated border border-border-subtle hover:border-sage/40 transition-colors"
              >
                <p className="font-medium text-text-primary text-[15px] mb-0.5">
                  {service.title}
                </p>
                <p className="text-text-muted text-sm leading-relaxed">
                  {service.tagline}
                </p>
                {/* TODO(mario): replace with a real from-price and typical
                    first booking once rates are settled, e.g.
                    "From $X · typical first booking: 5 meals" */}
                <p className="text-text-sage text-xs font-medium mt-2 tracking-wide">
                  Exact rate in your free conversation
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center p-8 md:p-10 rounded-[var(--radius-xl)] bg-surface border border-border-subtle">
            <h2 className="text-h3 font-heading mb-3">
              Get your numbers, for free.
            </h2>
            <p className="text-text-body text-[15px] mb-7 max-w-md mx-auto leading-[1.75]">
              Four questions, one conversation, and you&apos;ll have a plan
              with a price on every line — and no obligation to book any
              of it.
            </p>
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
