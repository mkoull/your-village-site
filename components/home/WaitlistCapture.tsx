"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLeadForm } from "@/lib/use-lead-form";
import FormError from "@/components/ui/FormError";
import Link from "next/link";

export default function WaitlistCapture() {
  const [email, setEmail] = useState("");
  const { send, sending, submitted, error } = useLeadForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    void send("waitlist", { email });
  };

  return (
    <section className="waitlist-section bg-dark text-text-inverse py-20 md:py-24 lg:py-28">
      <Container narrow>
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-h1 font-heading text-text-inverse mb-8 max-w-lg mx-auto leading-[1.1]">
              Your family deserves
              <br />
              <span className="text-sage">a village.</span>
            </h2>
            <p className="text-text-inverse/75 mb-12 max-w-md mx-auto leading-[1.8] text-[15px]">
              Find the support that fits your life. Start with one thing, and
              build from there.
            </p>

            {/* The conversation is the conversion — email capture is the fallback */}
            <div className="mb-14">
              <Button href="/get-started" size="lg">
                Build my village
                <span aria-hidden="true">&rarr;</span>
              </Button>
              <p className="text-text-inverse/60 text-xs mt-4 tracking-wide">
                Explore your starting point. No contact details needed.
              </p>
            </div>

            {!submitted ? (
              <div className="max-w-md mx-auto">
                <p className="text-text-inverse/60 text-sm mb-5">
                  Not ready yet? Stay in the loop instead.
                </p>
                <form
                  aria-busy={sending}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center gap-3"
                >
                  <label htmlFor="capture-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="capture-email"
                    autoComplete="email"
                    maxLength={254}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="waitlist-input flex-1 w-full px-6 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-text-inverse placeholder:text-white/30 focus:outline-none text-sm transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-7 py-3.5 rounded-full border border-white/[0.16] text-text-inverse/80 font-medium text-sm hover:border-sage hover:text-sage transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    {sending ? "Sending…" : "Keep me posted"}
                  </button>
                </form>
                <FormError message={error} />
                <p className="mt-4 text-xs text-text-inverse/70">
                  Your details are sent only when you submit.{" "}
                  <Link href="/privacy" className="underline">
                    Privacy
                  </Link>
                </p>
              </div>
            ) : (
              <p className="text-sage-light font-medium">
                You&apos;re on the list. We&apos;ll be in touch.
              </p>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
