"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { services } from "@/content/services";

const stages = [
  "Expecting",
  "Just had a baby",
  "Baby is a few months old",
  "Other",
];

export default function GetStartedPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    stage: "",
    needs: [] as string[],
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 4;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Please enter your name";
      if (!formData.email.trim()) newErrors.email = "Please enter your email";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Please enter a valid email";
    }

    if (step === 1) {
      if (!formData.stage) newErrors.stage = "Please select a stage";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    // Placeholder — POST to webhook
    try {
      // BACKEND INTEGRATION POINT
      // Replace with your Zapier/Make/Netlify webhook URL
      // await fetch("YOUR_WEBHOOK_URL", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  const toggleNeed = (slug: string) => {
    setFormData((prev) => ({
      ...prev,
      needs: prev.needs.includes(slug)
        ? prev.needs.filter((n) => n !== slug)
        : [...prev.needs, slug],
    }));
  };

  if (submitted) {
    return (
      <div className="pt-24 md:pt-32 pb-16 md:pb-20 min-h-[80vh] flex items-center">
        <Container narrow className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-h2 font-heading mb-4">Thank you.</h1>
          <p className="text-text-muted max-w-md mx-auto leading-relaxed">
            Our team will be in touch within a few hours. In the
            meantime, take a breath — you&apos;ve taken a really good first step.
          </p>
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
              Start with a conversation.
            </h1>
            <p className="text-text-muted">
              No pressure. No commitment. Just tell us a little about your
              situation.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="p-8 md:p-12 rounded-[var(--radius-xl)] bg-elevated border border-border-subtle shadow-md">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-10">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i <= step ? "bg-sage" : "bg-border"
                  )}
                />
              ))}
            </div>

            {/* Step 0: Contact details */}
            {step === 0 && (
              <div>
                <h2 className="text-h3 font-heading mb-6">
                  Tell us a bit about you.
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-body mb-1.5 font-body">
                      Your name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-background text-text-body placeholder:text-text-muted focus:outline-none focus:border-sage text-[15px]"
                      placeholder="First name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-body mb-1.5 font-body">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-background text-text-body placeholder:text-text-muted focus:outline-none focus:border-sage text-[15px]"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-body mb-1.5 font-body">
                      Phone{" "}
                      <span className="text-text-muted font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-background text-text-body placeholder:text-text-muted focus:outline-none focus:border-sage text-[15px]"
                      placeholder="04xx xxx xxx"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Journey stage */}
            {step === 1 && (
              <div>
                <h2 className="text-h3 font-heading mb-6">
                  Where are you in your journey?
                </h2>
                {errors.stage && (
                  <p className="text-sm text-red-500 mb-4">{errors.stage}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stages.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setFormData({ ...formData, stage })}
                      className={cn(
                        "p-4 rounded-[var(--radius-md)] border text-left transition-all duration-200 cursor-pointer font-medium text-[15px]",
                        formData.stage === stage
                          ? "border-sage text-sage bg-sage/5"
                          : "border-border text-text-body hover:border-sage/50"
                      )}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Needs */}
            {step === 2 && (
              <div>
                <h2 className="text-h3 font-heading mb-2">
                  What kind of support are you looking for?
                </h2>
                <p className="text-text-muted text-sm mb-6">
                  Select as many as you like — or none. We&apos;ll help you
                  figure it out.
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
                </div>
              </div>
            )}

            {/* Step 3: Notes */}
            {step === 3 && (
              <div>
                <h2 className="text-h3 font-heading mb-2">
                  Anything else you&apos;d like us to know?
                </h2>
                <p className="text-text-muted text-sm mb-6">
                  Totally optional. Whatever helps us understand your
                  situation.
                </p>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-border bg-background text-text-body placeholder:text-text-muted focus:outline-none focus:border-sage text-[15px] resize-none"
                  placeholder="E.g. 'My baby is 6 weeks old and I'm struggling with sleep and feeding. My partner goes back to work next week.'"
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-subtle">
              {step > 0 ? (
                <button
                  onClick={back}
                  className="text-sm text-text-muted hover:text-text-body transition-colors cursor-pointer"
                >
                  &larr; Back
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps - 1 ? (
                <button
                  onClick={next}
                  className="px-6 py-2.5 rounded-full bg-sage text-white text-sm font-medium hover:bg-sage-dark transition-colors cursor-pointer"
                >
                  Continue &rarr;
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-full bg-sage text-white text-sm font-medium hover:bg-sage-dark transition-colors cursor-pointer"
                >
                  Send &rarr;
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </div>
  );
}
