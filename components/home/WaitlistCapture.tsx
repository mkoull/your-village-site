"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WaitlistCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Placeholder — hook up to webhook/email service
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
            <p className="text-text-inverse/50 mb-14 max-w-sm mx-auto leading-[1.8] text-[15px]">
              Be the first to hear about new services and areas as we grow.
            </p>

            {!submitted ? (
              <div className="space-y-6">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="waitlist-input flex-1 w-full px-6 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-text-inverse placeholder:text-white/30 focus:outline-none text-sm transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-full bg-sage text-white font-medium text-sm hover:bg-sage-light transition-all duration-300 cursor-pointer whitespace-nowrap hover:shadow-[0_0_24px_rgba(139,158,124,0.3)]"
                  >
                    Keep me posted
                  </button>
                </form>

                <p className="text-text-inverse/30 text-xs tracking-wide">
                  or
                </p>

                <Button href="/get-started" variant="ghost" className="!text-text-inverse/60 hover:!text-sage">
                  Start a conversation
                  <span aria-hidden="true">&rarr;</span>
                </Button>
              </div>
            ) : (
              <p className="text-sage font-medium text-lg">
                You&apos;re on the list. We&apos;ll be in touch.
              </p>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
