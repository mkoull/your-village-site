"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLeadForm } from "@/lib/use-lead-form";
import FormError from "@/components/ui/FormError";
import Link from "next/link";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [suburb, setSuburb] = useState("");
  const { send, sending, submitted, error } = useLeadForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    void send("waitlist", { email, suburb });
  };

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20 min-h-[80vh] flex items-center">
      <Container narrow className="text-center">
        <ScrollReveal>
          {!submitted ? (
            <>
              <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-text-sage mb-4 font-body">
                Waitlist
              </p>
              <h1 className="text-h1 font-heading mb-4">
                Be the first to know.
              </h1>
              <p className="text-text-muted max-w-md mx-auto mb-10 leading-relaxed">
                We&apos;re growing Your Village. Enter your email and we&apos;ll
                let you know when we launch new services and areas.
              </p>

              <form
                aria-busy={sending}
                onSubmit={handleSubmit}
                className="max-w-md mx-auto space-y-4"
              >
                <label
                  htmlFor="waitlist-email"
                  className="block text-sm text-left"
                >
                  Email address
                </label>
                <input
                  id="waitlist-email"
                  autoComplete="email"
                  maxLength={254}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-5 py-3 rounded-[var(--radius-sm)] border border-border bg-elevated text-text-body placeholder:text-text-muted focus:outline-none focus:border-sage text-[15px]"
                />
                <label
                  htmlFor="waitlist-suburb"
                  className="block text-sm text-left"
                >
                  Suburb (optional)
                </label>
                <input
                  id="waitlist-suburb"
                  autoComplete="address-level2"
                  maxLength={120}
                  type="text"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="Your suburb (optional)"
                  className="w-full px-5 py-3 rounded-[var(--radius-sm)] border border-border bg-elevated text-text-body placeholder:text-text-muted focus:outline-none focus:border-sage text-[15px]"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-6 py-3 rounded-full bg-sage-deep text-white font-medium text-[15px] hover:bg-sage-dark transition-colors cursor-pointer"
                >
                  {sending ? "Sending…" : "Keep me posted"}
                </button>
              </form>
              <FormError message={error} />
              <p className="mt-4 text-xs text-text-muted">
                Your details are sent only when you submit.{" "}
                <Link href="/privacy" className="underline">
                  Privacy
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-sage"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="text-h2 font-heading mb-4">
                You&apos;re on the list.
              </h1>
              <p className="text-text-muted max-w-md mx-auto">
                We&apos;ll be in touch when there&apos;s something to share.
              </p>
            </>
          )}
        </ScrollReveal>
      </Container>
    </div>
  );
}
