"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Objection handling, placed right before the final CTA. Answers stay
// honest — no invented pricing, stats, or promises.
const faqs = [
  {
    question: "What does it cost?",
    answer:
      "It depends on what your village includes — a weekly meal delivery is very different from overnight care. The first conversation is free, and you'll have a clear picture of costs before anything begins. No lock-ins, no surprises.",
  },
  {
    question: "I don't even know what I need. Is that okay?",
    answer:
      "It's the most common way families come to us. You don't need a plan — that's our job. Tell us what feels hard, and we'll suggest where support would make the biggest difference first.",
  },
  {
    question: "Who are the providers? Are they vetted?",
    answer:
      "Every provider is background-checked, has their qualifications verified, and is personally reviewed before joining our network. Our test is simple: if we wouldn't send them to someone we love, they're not in the village.",
  },
  {
    question: "How quickly can support start?",
    answer:
      "We start arranging things straight after our first conversation. Some support, like meals and household help, can begin within days; specialist bookings depend on availability. If things feel urgent, tell us — we'll prioritise what matters most.",
  },
  {
    question: "Is this only for mums?",
    answer:
      "No. We support parents of every kind — dads and partners, single parents, adoptive and foster families, same-sex parents, families of multiples. Every family shape, every path to parenthood.",
  },
  {
    question: "Can I arrange this as a gift for someone?",
    answer:
      "Yes — real support is one of the most meaningful gifts a new family can receive. Get in touch and we'll help you set something up that fits them, from a week of meals to something more ongoing.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We're focused on inner Melbourne, deliberately — it means we know every provider personally. Outside the area? Join the waitlist and we'll let you know as we grow.",
  },
];

function FaqItem({ faq }: { faq: (typeof faqs)[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full py-6 flex items-center justify-between gap-6 text-left cursor-pointer group"
      >
        <span className="font-heading text-[1.15rem] md:text-[1.25rem] text-text-primary group-hover:text-sage transition-colors">
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
        <p className="pb-7 pr-10 text-text-muted leading-[1.85] text-[15px] animate-fade-in">
          {faq.answer}
        </p>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="py-32 md:py-40 lg:py-48">
      <Container narrow>
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <p className="text-eyebrow uppercase tracking-[0.25em] font-semibold text-sage mb-5 font-body">
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
          <div className="text-center mt-14">
            <p className="text-text-muted text-sm mb-6">
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
