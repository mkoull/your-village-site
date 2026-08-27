"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { submitLead } from "@/lib/leads";

export default function WaitlistCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    void submitLead("waitlist", { email });
    setSubmitted(true);
  };

  return (
    <section className="waitlist-section bg-dark text-text-inverse py-32 md:py-40 lg:py-52">
      <Container narrow>
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-h1 font-heading text-text-inverse mb-8 max-w-lg mx-auto leading-[1.1]">
              Your family deserves
              <br />
              <span className="text-sage">a village.</span>
            </h2>
            <p className="text-text-inverse/50 mb-12 max-w-md mx-auto leading-[1.8] text-[15px]">
              One conversation is all it takes to start. Tell us what&apos;s
              hard &mdash; we&apos;ll take it from there.
            </p>

            {/* The conversation is the conversion — email capture is the fallback */}
            <div className="mb-14">
              <Button href="/get-started" size="lg">
                Start a conversation
                <span aria-hidden="true">&rarr;</span>
              </Button>
              <p className="text-text-inverse/40 text-xs mt-4 tracking-wide">
                Free first chat. A real person replies.
              </p>
            </div>

            {!submitted ? (
              <div className="max-w-md mx-auto">
                <p className="text-text-inverse/40 text-sm mb-5">
                  Not ready yet? Stay in the loop instead.
                </p>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center gap-3"
                >
                  <label htmlFor="capture-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="capture-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="waitlist-input flex-1 w-full px-6 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-text-inverse placeholder:text-white/30 focus:outline-none text-sm transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-full border border-white/[0.16] text-text-inverse/80 font-medium text-sm hover:border-sage hover:text-sage transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    Keep me posted
                  </button>
                </form>
              </div>
            ) : (
              <p className="text-sage font-medium">
                You&apos;re on the list. We&apos;ll be in touch.
              </p>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
