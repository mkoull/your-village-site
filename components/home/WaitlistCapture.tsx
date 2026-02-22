"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
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
    <section className="bg-dark text-text-inverse py-24 md:py-32 lg:py-40">
      <Container narrow>
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-h2 font-heading text-text-inverse mb-4">
              Stay in the loop.
            </h2>
            <p className="text-text-inverse/60 mb-10 max-w-md mx-auto">
              Be the first to hear about new services and areas as we grow.
            </p>

            {!submitted ? (
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
                  className="flex-1 w-full px-5 py-3 rounded-full bg-white/10 border border-white/20 text-text-inverse placeholder:text-white/40 focus:outline-none focus:border-sage text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-sage text-white font-medium text-sm hover:bg-sage-light transition-colors cursor-pointer whitespace-nowrap"
                >
                  Keep me posted
                </button>
              </form>
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
