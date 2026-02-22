"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // BACKEND INTEGRATION POINT: POST to webhook
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="min-h-[80dvh] flex items-center pt-32 pb-20">
        <Container narrow className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/15 text-sage mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-8 h-8">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-h1 font-heading mb-4">We&apos;ll be in touch.</h1>
          <p className="text-text-muted text-body-lg">
            Thanks for reaching out. We typically respond within a few hours.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-20">
      <Container narrow>
        <ScrollReveal>
          <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body text-center">
            Get in touch
          </p>
          <h1 className="text-h1 font-heading text-center mb-4">
            Talk to us
          </h1>
          <p className="text-text-muted text-body-lg text-center mb-12 max-w-lg mx-auto">
            No commitment. No pressure. Just a conversation about what support
            could look like for your family.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-lg mx-auto"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                Your name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-colors"
                placeholder="First name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-colors"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                How can we help?
              </label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-colors resize-none"
                placeholder="Tell us a bit about your situation — due date, what you're looking for, or anything on your mind."
              />
            </div>

            <Button type="submit" className="w-full justify-center">
              Send message
              <span aria-hidden="true">&rarr;</span>
            </Button>

            <p className="text-xs text-text-muted text-center">
              We typically respond within a few hours during business hours.
            </p>
          </form>
        </ScrollReveal>
      </Container>
    </section>
  );
}
