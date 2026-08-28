"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

// The real objections, answered honestly. Placed right before the
// final CTA. No invented pricing, stats, or promises.
const faqs = [
  {
    question: "What does it cost, and how do you make money?",
    answer: (
      <>
        You pay for the support you book, and our coordination is part of
        the price — no surprise line items. The first conversation is free,
        and you see the exact cost of every part of your plan before
        anything is booked. Full structure on our{" "}
        <Link href="/pricing" className="text-text-sage underline underline-offset-2">pricing page</Link>.
      </>
    ),
  },
  {
    question: "Do I have to be dressed? Is my house being judged?",
    answer:
      "No, and never. Every provider we send has worked in real postpartum homes: dishes in the sink, washing on the couch, pyjamas at 2pm. That is the job, not a problem. Nobody is assessing you — they're there to make your day lighter.",
  },
  {
    question: "Can I book just one thing?",
    answer:
      "Yes. Plenty of families start with a single thing — a week of meals, one overnight, one lactation visit. There's no minimum, and starting small is a completely normal way to test whether we're right for you.",
  },
  {
    question: "Is it a subscription? Am I locked in?",
    answer:
      "No lock-ins, no subscription you have to escape from. Everything can change, pause or stop at any time. You pay for what's delivered.",
  },
  {
    question: "How fast can help actually start?",
    answer:
      "We reply the same day, usually within a few hours, and start arranging straight after we talk. Meals and household help can often begin within days; specialist bookings depend on availability. If things feel urgent, say so — we'll sequence what matters most first.",
  },
  {
    question: "What if we don't click with a carer?",
    answer:
      "Tell us — that's what one point of contact is for. You never have to have an awkward conversation with a provider; we handle it and rematch you. Fit matters, and it's our job to get it right.",
  },
  {
    question: "How are providers checked?",
    answer: (
      <>
        Working with Children Check, national police check, qualifications
        verified, insurance confirmed, references checked by us, and a
        proper conversation with every provider before they join. The full
        checklist is on our{" "}
        <Link href="/safety" className="text-text-sage underline underline-offset-2">safety page</Link>.
      </>
    ),
  },
  {
    question: "What happens to my information?",
    answer: (
      <>
        It stays between you and our team, is shared with a provider only
        so far as they need it to help you, and is never sold. Details on
        the{" "}
        <Link href="/privacy" className="text-text-sage underline underline-offset-2">privacy page</Link>.
      </>
    ),
  },
  {
    question: "Do you work with midwives and GPs?",
    answer:
      "We're a coordination service, not a clinical one — we don't replace your midwife, MCH nurse or GP, and we'll always encourage you to keep them in the loop. If your care team has recommended particular support, tell us and we'll build around it.",
  },
  {
    question: "Can someone else pay for this?",
    answer:
      "Yes — grandparents, friends, a workplace. Support is one of the most meaningful gifts a new family can receive. Get in touch and we'll help you set something up that fits them.",
  },
];

function FaqItem({ faq }: { faq: (typeof faqs)[0] }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    if (!open) trackEvent("faq_opened", { question: faq.question.slice(0, 60) });
    setOpen(!open);
  };

  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={toggle}
        aria-expanded={open}
        className="w-full py-5 flex items-center justify-between gap-6 text-left cursor-pointer group"
      >
        <span className="font-heading text-[1.1rem] md:text-[1.2rem] text-text-primary group-hover:text-sage transition-colors">
          {faq.question}
        </span>
        <svg
          className={cn(
            "w-5 h-5 text-text-muted shrink-0 transition-transform duration-300",
            open && "rotate-180 text-sage"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="pb-6 pr-10 text-text-body leading-[1.8] text-[15px] animate-fade-in">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="py-20 md:py-24 lg:py-28">
      <Container narrow>
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-text-sage mb-4 font-body">
              The things you&apos;re wondering
            </p>
            <h2 className="text-h2 font-heading max-w-md mx-auto">
              Fair questions, honest answers.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="border-t border-border-subtle">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} faq={faq} />
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="text-center mt-12">
            <p className="text-text-muted text-sm mb-5">
              Something else on your mind?
            </p>
            <Button href="/contact" variant="secondary" size="sm">
              Ask us anything
              <span aria-hidden="true">&rarr;</span>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
