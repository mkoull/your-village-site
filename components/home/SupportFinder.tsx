"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

const steps = [
  {
    question: "What stage are you at?",
    options: [
      { label: "Expecting", value: "expecting" },
      { label: "Newborn (0-3 months)", value: "newborn" },
      { label: "Baby (3-12 months)", value: "baby" },
    ],
  },
  {
    question: "What feels hardest right now?",
    options: [
      { label: "Feeding", value: "feeding" },
      { label: "Sleep", value: "sleep" },
      { label: "Feeling overwhelmed", value: "overwhelm" },
      { label: "Household tasks", value: "household" },
      { label: "Feeling isolated", value: "isolation" },
      { label: "A bit of everything", value: "everything" },
    ],
  },
  {
    question: "How are you feeling about getting help?",
    options: [
      { label: "Just exploring", value: "curious" },
      { label: "Ready to chat", value: "ready" },
      { label: "Need support soon", value: "soon" },
    ],
  },
];

const serviceMap: Record<string, string[]> = {
  feeding: ["Lactation Support", "Food Support"],
  sleep: ["Sleep Support", "Postpartum Carers"],
  overwhelm: ["Emotional Support", "Life Admin"],
  household: ["Household Help", "Food Support"],
  isolation: ["Community Connection", "Emotional Support"],
  everything: ["Postpartum Carers", "Emotional Support", "Food Support"],
};

export default function SupportFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const handleSelect = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setFinished(false);
  };

  const suggestedServices = finished
    ? serviceMap[answers[1]] || ["Postpartum Carers", "Food Support"]
    : [];

  return (
    <section className="py-24 md:py-32 lg:py-40">
      <Container narrow>
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
              Not sure where to start?
            </p>
            <h2 className="text-h2 font-heading">
              Find the right support in 30 seconds.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="p-8 md:p-12 rounded-[var(--radius-xl)] bg-elevated border border-border-subtle shadow-md">
            {!finished ? (
              <>
                {/* Progress */}
                <div className="flex items-center gap-2 mb-8">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= currentStep ? "bg-sage" : "bg-border"
                      }`}
                    />
                  ))}
                </div>

                <h3 className="text-h3 font-heading mb-6">
                  {steps[currentStep].question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {steps[currentStep].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className="p-4 rounded-[var(--radius-md)] border border-border text-left text-text-body hover:border-sage hover:text-sage transition-all duration-200 cursor-pointer font-medium text-[15px]"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {currentStep > 0 && (
                  <button
                    onClick={() => {
                      setCurrentStep(currentStep - 1);
                      setAnswers(answers.slice(0, -1));
                    }}
                    className="mt-4 text-sm text-text-muted hover:text-text-body transition-colors cursor-pointer"
                  >
                    &larr; Back
                  </button>
                )}
              </>
            ) : (
              <div className="text-center">
                <p className="text-sage font-medium mb-4 font-body">
                  Based on what you&apos;ve told us, we&apos;d suggest:
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {suggestedServices.map((service) => (
                    <span
                      key={service}
                      className="px-4 py-2 rounded-full bg-sage/10 text-sage text-sm font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <p className="text-text-muted mb-8 text-sm">
                  Your coordinator will tailor the support to your exact needs.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button href="/get-started">
                    Talk to us
                    <span aria-hidden="true">&rarr;</span>
                  </Button>
                  <button
                    onClick={reset}
                    className="text-sm text-text-muted hover:text-text-body transition-colors cursor-pointer"
                  >
                    Start again
                  </button>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
