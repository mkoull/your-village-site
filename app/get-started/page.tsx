"use client";

import { useRef, useState } from "react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { services } from "@/content/services";
import { submitLead } from "@/lib/leads";

/**
 * Support assessment — a calm, intake-style flow.
 * Contact details are deliberately the LAST step: people share more
 * openly when they haven't been asked for their email yet, and the
 * questions themselves should feel like the start of a conversation,
 * not a form gate.
 */

const stageOptions = [
  { label: "We're expecting", value: "expecting" },
  { label: "Newborn (0–3 months)", value: "newborn" },
  { label: "Baby (3–12 months)", value: "baby" },
  { label: "Somewhere else entirely", value: "other" },
];

const aroundYouOptions = [
  { label: "Family close by who can help", value: "family-nearby" },
  { label: "Support exists, but not close by", value: "family-far" },
  { label: "A partner — mostly doing it ourselves", value: "partner" },
  { label: "Mostly just me", value: "solo" },
];

const timingOptions = [
  { label: "As soon as possible", value: "asap" },
  { label: "In the next few weeks", value: "soon" },
  { label: "Planning ahead", value: "planning" },
  { label: "Just exploring for now", value: "exploring" },
];

const NOT_SURE = "not-sure";

// Quiet mapping from selected needs to service titles — surfaced only
// as a considered suggestion on the confirmation screen.
function suggestFor(needs: string[]): string[] {
  const chosen = services
    .filter((s) => needs.includes(s.slug))
    .map((s) => s.title);
  if (chosen.length > 0) return chosen.slice(0, 3);
  return ["Postpartum Carers", "Food Support"];
}

const TOTAL_STEPS = 5;

export default function GetStartedPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    stage: "",
    needs: [] as string[],
    aroundYou: "",
    timing: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (next: number) => {
    setErrors({});
    setStep(next);
  };

  // Single-choice steps advance on their own — one less thing to do.
  const selectAndAdvance = (field: "stage" | "aroundYou" | "timing", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => goTo(step + 1), 260);
  };

  const toggleNeed = (slug: string) => {
    setFormData((prev) => {
      if (slug === NOT_SURE) {
        return { ...prev, needs: prev.needs.includes(NOT_SURE) ? [] : [NOT_SURE] };
      }
      const withoutNotSure = prev.needs.filter((n) => n !== NOT_SURE);
      return {
        ...prev,
        needs: withoutNotSure.includes(slug)
          ? withoutNotSure.filter((n) => n !== slug)
          : [...withoutNotSure, slug],
      };
    });
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Please tell us your name";
    if (!formData.email.trim()) newErrors.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSending(true);
    await submitLead("assessment", formData);
    setSubmitted(true);
  };

  if (submitted) {
    const suggestions = suggestFor(formData.needs);
    return (
      <div className="pt-24 md:pt-32 pb-16 md:pb-20 min-h-[80vh] flex items-center">
        <Container narrow className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-h2 font-heading mb-4">
            Thank you, {formData.name.trim().split(/\s+/)[0]}.
          </h1>
          <p className="text-text-muted max-w-md mx-auto leading-relaxed mb-10">
            We&apos;ll be in touch within a few hours to talk it through.
            In the meantime, take a breath — you&apos;ve taken a really good
            first step.
          </p>
          <p className="text-sm text-text-muted mb-4">
            From what you&apos;ve shared, we&apos;ll likely start the
            conversation around:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((title) => (
              <span
                key={title}
                className="px-5 py-2.5 rounded-full bg-sage/10 text-sage text-sm font-medium"
              >
                {title}
              </span>
            ))}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20 min-h-[80vh]">
      <Container narrow>
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              Get started
            </p>
            <h1 className="text-h1 font-heading mb-4">
              Let&apos;s find your kind of support.
            </h1>
            <p className="text-text-muted max-w-md mx-auto">
              A few quick questions so the conversation starts in the right
              place. Takes about a minute.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="p-8 md:p-12 rounded-[var(--radius-xl)] bg-elevated border border-border-subtle shadow-md">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-10" aria-hidden="true">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors duration-500",
                    i <= step ? "bg-sage" : "bg-border"
                  )}
                />
              ))}
            </div>

            {/* Step 0: Stage */}
            {step === 0 && (
              <div>
                <h2 className="text-h3 font-heading mb-6">
                  Where are you at?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stageOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => selectAndAdvance("stage", option.value)}
                      className={cn(
                        "p-4 rounded-[var(--radius-md)] border text-left transition-all duration-200 cursor-pointer font-medium text-[15px]",
                        formData.stage === option.value
                          ? "border-sage text-sage bg-sage/5"
                          : "border-border text-text-body hover:border-sage/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Needs (multi-select) */}
            {step === 1 && (
              <div>
                <h2 className="text-h3 font-heading mb-2">
                  What feels hardest right now?
                </h2>
                <p className="text-text-muted text-sm mb-6">
                  Choose as many as you like. There are no wrong answers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.slug}
                      onClick={() => toggleNeed(service.slug)}
                      className={cn(
                        "p-4 rounded-[var(--radius-md)] border text-left transition-all duration-200 cursor-pointer text-[15px]",
                        formData.needs.includes(service.slug)
                          ? "border-sage text-sage bg-sage/5"
                          : "border-border text-text-body hover:border-sage/50"
                      )}
                    >
                      <span className="font-medium">{service.title}</span>
                      <span className="block text-xs text-text-muted mt-0.5">
                        {service.tagline}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => toggleNeed(NOT_SURE)}
                    className={cn(
                      "p-4 rounded-[var(--radius-md)] border text-left transition-all duration-200 cursor-pointer text-[15px]",
                      formData.needs.includes(NOT_SURE)
                        ? "border-sage text-sage bg-sage/5"
                        : "border-border text-text-body hover:border-sage/50"
                    )}
                  >
                    <span className="font-medium">I&apos;m not sure yet</span>
                    <span className="block text-xs text-text-muted mt-0.5">
                      That&apos;s completely fine — we&apos;ll figure it out together
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Who's around you */}
            {step === 2 && (
              <div>
                <h2 className="text-h3 font-heading mb-2">
                  Who&apos;s around you at the moment?
                </h2>
                <p className="text-text-muted text-sm mb-6">
                  This helps us understand where support would make the most
                  difference.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {aroundYouOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => selectAndAdvance("aroundYou", option.value)}
                      className={cn(
                        "p-4 rounded-[var(--radius-md)] border text-left transition-all duration-200 cursor-pointer font-medium text-[15px]",
                        formData.aroundYou === option.value
                          ? "border-sage text-sage bg-sage/5"
                          : "border-border text-text-body hover:border-sage/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Timing */}
            {step === 3 && (
              <div>
                <h2 className="text-h3 font-heading mb-6">
                  When would you like support to start?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {timingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => selectAndAdvance("timing", option.value)}
                      className={cn(
                        "p-4 rounded-[var(--radius-md)] border text-left transition-all duration-200 cursor-pointer font-medium text-[15px]",
                        formData.timing === option.value
                          ? "border-sage text-sage bg-sage/5"
                          : "border-border text-text-body hover:border-sage/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Contact details — deliberately last */}
            {step === 4 && (
              <div>
                <h2 className="text-h3 font-heading mb-2">
                  Where should we reach you?
                </h2>
                <p className="text-text-muted text-sm mb-6">
                  A real person will be in touch — usually within a few hours.
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="gs-name" className="block text-sm font-medium text-text-body mb-1.5 font-body">
                      Your name
                    </label>
                    <input
                      id="gs-name"
                      type="text"
                      autoComplete="given-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-background text-text-body placeholder:text-text-muted focus:outline-none focus:border-sage text-[15px]"
                      placeholder="First name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="gs-email" className="block text-sm font-medium text-text-body mb-1.5 font-body">
                      Email
                    </label>
                    <input
                      id="gs-email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-background text-text-body placeholder:text-text-muted focus:outline-none focus:border-sage text-[15px]"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="gs-phone" className="block text-sm font-medium text-text-body mb-1.5 font-body">
                      Phone{" "}
                      <span className="text-text-muted font-normal">(optional)</span>
                    </label>
                    <input
                      id="gs-phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-background text-text-body placeholder:text-text-muted focus:outline-none focus:border-sage text-[15px]"
                      placeholder="04xx xxx xxx"
                    />
                  </div>
                  <div>
                    <label htmlFor="gs-notes" className="block text-sm font-medium text-text-body mb-1.5 font-body">
                      Anything else?{" "}
                      <span className="text-text-muted font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="gs-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-background text-text-body placeholder:text-text-muted focus:outline-none focus:border-sage text-[15px] resize-none"
                      placeholder="Whatever helps us understand your situation."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-subtle">
              {step > 0 ? (
                <button
                  onClick={() => goTo(step - 1)}
                  className="text-sm text-text-muted hover:text-text-body transition-colors cursor-pointer"
                >
                  &larr; Back
                </button>
              ) : (
                <div />
              )}

              {step === 1 && (
                <button
                  onClick={() => goTo(2)}
                  className="px-6 py-2.5 rounded-full bg-sage text-white text-sm font-medium hover:bg-sage-dark transition-colors cursor-pointer"
                >
                  Continue &rarr;
                </button>
              )}
              {step === 4 && (
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="px-6 py-2.5 rounded-full bg-sage text-white text-sm font-medium hover:bg-sage-dark transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default"
                >
                  {sending ? "Sending…" : "Send →"}
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        <p className="text-xs text-text-muted text-center mt-6">
          Your answers stay between you and our team. No newsletters, no
          sharing — just the conversation you asked for.
        </p>
      </Container>
    </div>
  );
}
