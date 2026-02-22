"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function NotATodoSection() {
  return (
    <section className="bg-surface py-16 md:py-20 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div>
              <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-sage mb-4 font-body">
                The model
              </p>
              <h2 className="text-h2 font-heading mb-6">
                An ecosystem, not another to-do list.
              </h2>
              <div className="space-y-4 text-text-body leading-relaxed">
                <p>
                  You don&apos;t need another app, another account, or another
                  decision to make. Your Village is a coordination layer — we plug
                  trusted providers into your life, managed by someone who already
                  knows your situation.
                </p>
                <p className="text-text-muted">
                  Think of it as your personal support team, assembled and managed
                  for you. Meals, care, counselling, cleaning — flowing to your
                  family as you need them.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger={2}>
            <div className="relative">
              {/* Visual: connected circles representing the ecosystem */}
              <div className="aspect-square max-w-sm mx-auto relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-sage/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-sage font-body">
                      Your family
                    </span>
                  </div>
                </div>
                {[
                  { label: "Food", angle: 0 },
                  { label: "Care", angle: 45 },
                  { label: "Sleep", angle: 90 },
                  { label: "Lactation", angle: 135 },
                  { label: "Counselling", angle: 180 },
                  { label: "Cleaning", angle: 225 },
                  { label: "Admin", angle: 270 },
                  { label: "Community", angle: 315 },
                ].map((item) => {
                  const radius = 42;
                  const rad = (item.angle * Math.PI) / 180;
                  const x = 50 + radius * Math.cos(rad);
                  const y = 50 + radius * Math.sin(rad);
                  return (
                    <div
                      key={item.label}
                      className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full bg-elevated border border-border flex items-center justify-center shadow-sm"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <span className="text-xs text-text-muted font-medium font-body">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
