"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { services, type Service } from "@/content/services";
import { submitLead } from "@/lib/leads";
import { trackEvent } from "@/lib/analytics";
import { getAnonId } from "@/lib/anon";

/**
 * Support assessment — a value-first funnel.
 * Four questions build a personalised "starting village" plan, shown
 * generously before the contact ask. Contact details stay LAST.
 *
 * Every answer is beaconed to the lead webhook immediately (type
 * "quiz_step", keyed to an anonymous id), so families who drop out
 * before the final screen are still visible. Question 1 can arrive
 * pre-filled from the hero via ?stage=.
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

const timingLines: Record<string, string> = {
  asap: "You said as soon as possible — we'll treat it that way.",
  soon: "You're thinking the next few weeks — that gives us time to get it right.",
  planning: "Planning ahead is the calmest way to do this. Everything can be ready before you need it.",
  exploring: "No rush at all — this plan will keep. We're here whenever you're ready.",
};

const NOT_SURE = "not-sure";
const DEFAULT_PLAN_SLUGS = ["postpartum-carers", "food", "counselling"];
const VALID_STAGES = new Set(stageOptions.map((o) => o.value));

function buildPlan(needs: string[]): { plan: Service[]; isDefault: boolean } {
  const chosen = services.filter((s) => needs.includes(s.slug));
  if (chosen.length > 0) return { plan: chosen.slice(0, 3), isDefault: false };
  return {
    plan: services.filter((s) => DEFAULT_PLAN_SLUGS.includes(s.slug)),
    isDefault: true,
  };
}

const TOTAL_STEPS = 5;

function GetStartedFlow() {
  const searchParams = useSearchParams();
  const prefilledStage = searchParams.get("stage");
  const founding = searchParams.get("ref") === "founding";
  const validPrefill = prefilledStage && VALID_STAGES.has(prefilledStage);

  const [step, setStep] = useState(validPrefill ? 1 : 0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    stage: validPrefill ? prefilledStage : "",
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
  const started = useRef(Boolean(validPrefill));
  const stepRef = useRef(step);
  stepRef.current = step;
  const submittedRef = useRef(false);
  submittedRef.current = submitted;

  // Abandonment: if the tab hides after starting and before submitting,
  // record how far they got.
  useEffect(() => {
    let reported = false;
    const onHide = () => {
      if (document.visibilityState === "hidden" && started.current && !submittedRef.current && !reported) {
        reported = true;
        trackEvent("quiz_abandoned", { step: stepRef.current });
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const beacon = (field: string, value: string | string[], stepNo: number) => {
    started.current = true;
    void submitLead("quiz_step", {
      anonId: getAnonId(),
      step: stepNo,
      field,
      value,
      answersSoFar: {
        stage: formData.stage,
        needs: formData.needs,
        aroundYou: formData.aroundYou,
        timing: formData.timing,
      },
      founding,
    });
    trackEvent("quiz_step_completed", { step: stepNo, field });
  };

  const goTo = (next: number) => {
    setErrors({});
    setStep(next);
  };

  // Single-choice steps advance on their own — one less thing to do.
  const selectAndAdvance = (field: "stage" | "aroundYou" | "timing", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    beacon(field, value, step);
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

  const continueFromNeeds = () => {
    beacon("needs", formData.needs, 1);
    goTo(2);
  };

  const { plan, isDefault } = buildPlan(formData.needs);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Please tell us your name";
    if (!formData.email.trim()) newErrors.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSending(true);
    await submitLead("assessment", {
      anonId: getAnonId(),
      ...formData,
      founding,
      plan: plan.map((s) => s.title),
    });
    trackEvent("lead_submitted", { type: "assessment", founding });
    setSubmitted(true);
  };

  if (submitted) {
    const firstName = formData.name.trim().split(/\s+/)[0];
    return (
      <div className="pt-24 md:pt-32 pb-16 md:pb-20 min-h-[80vh] flex items-center">
        <Container narrow className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-h2 font-heading mb-4">
            Your plan is on its way, {firstName}.
          </h1>
          <p className="text-text-muted max-w-md mx-auto leading-relaxed mb-10">
            A real person will reach out the same day &mdash;{" "}
            {formData.phone.trim()
              ? "we'll give you a call, and follow up by email"
              : "you'll hear from us by email"}
            . In the meantime, take a breath. You&apos;ve just done the hardest
            part.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {plan.map((service) => (
              <span
                key={service.slug}
                className="px-5 py-2.5 rounded-full bg-sage/10 text-text-sage text-sm font-medium"
              >
                {service.title}
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
          <div className="text-center mb-10">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-text-sage mb-4 font-body">
              {founding ? "Founding families" : "Get started"}
            </p>
            <h1 className="text-h1 font-heading mb-4">
              Let&apos;s sketch your village.
            </h1>
            <p className="text-text-muted max-w-md mx-auto">
              {validPrefill
                ? "Three more questions, then we'll show you where we'd begin for your family."
                : "Four quick questions, then we'll show you where we'd begin for your family. Takes about a minute."}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="p-6 md:p-12 rounded-[var(--radius-xl)] bg-elevated border border-border-subtle shadow-md">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8" aria-hidden="true">
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

            <div key={step} className="animate-fade-in">
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

            {/* Step 4: The plan — value first, then the ask */}
            {step === 4 && (
              <div>
                <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-text-sage mb-3 font-body">
                  Your starting village
                </p>
                <h2 className="text-h3 font-heading mb-2">
                  Here&apos;s where we&apos;d begin.
                </h2>
                <p className="text-text-muted text-sm mb-6">
                  {isDefault
                    ? "You said you're not sure yet — these three are where most families start, and we'll shape it together."
                    : "Based on what you've shared, this is the support we'd put in place first."}
                </p>

                <div className="space-y-3 mb-6">
                  {plan.map((service) => (
                    <div
                      key={service.slug}
                      className="flex items-start gap-4 p-4 rounded-[var(--radius-md)] border border-sage/25 bg-sage/[0.04]"
                    >
                      <div
                        className="w-9 h-9 shrink-0 rounded-full bg-sage/10 text-sage p-2"
                        dangerouslySetInnerHTML={{ __html: service.icon }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-text-primary text-[15px]">
                          {service.title}
                        </p>
                        <p className="text-text-muted text-sm leading-relaxed mt-0.5">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.timing && (
                  <p className="text-sm text-text-text-sage font-medium mb-8">
                    {timingLines[formData.timing]}
                  </p>
                )}

                <div className="border-t border-border-subtle pt-8">
                  <h3 className="text-h3 font-heading mb-2">
                    Want us to make it real?
                  </h3>
                  <p className="text-text-muted text-sm mb-6">
                    Leave your details and a real person will walk you through
                    your plan &mdash; the same day, usually within a few hours.
                  </p>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleSubmit();
                    }}
                  >
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
                        Best number for a quick call{" "}
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
                      <p className="text-xs text-text-muted mt-1.5">
                        Often easier than typing when your hands are full &mdash; if
                        you leave a number, we&apos;ll call.
                      </p>
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
                    <button type="submit" className="sr-only">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}
            </div>

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
                  onClick={continueFromNeeds}
                  className="px-6 py-2.5 rounded-full bg-sage-deep text-white text-sm font-medium hover:bg-sage-dark transition-colors cursor-pointer"
                >
                  Continue &rarr;
                </button>
              )}
              {step === 4 && (
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="px-6 py-2.5 rounded-full bg-sage-deep text-white text-sm font-medium hover:bg-sage-dark transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default"
                >
                  {sending ? "Sending…" : "Send me my plan →"}
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        <p className="text-xs text-text-muted text-center mt-6">
          Your answers stay between you and our team. No newsletters, no
          sharing &mdash; see our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-text-body">
            privacy page
          </Link>
          .
        </p>

        <p className="text-sm text-text-muted text-center mt-6">
          Rather skip the questions?{" "}
          <Link
            href="/contact"
            className="text-text-sage font-medium hover:text-sage-dark transition-colors underline underline-offset-4 decoration-sage/30"
          >
            Send us a message instead
          </Link>
        </p>
      </Container>
    </div>
  );
}

export default function GetStartedPage() {
  return (
    <Suspense fallback={null}>
      <GetStartedFlow />
    </Suspense>
  );
}
