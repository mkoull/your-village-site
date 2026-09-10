"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useVillage } from "./VillageProvider";
import VillageScene from "./VillageScene";
import VillageEnquiry from "./VillageEnquiry";
import ServiceSources from "./ServiceSources";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { services } from "@/content/services";
import { existingSupport } from "@/content/existing-support";
import { SITE_URL } from "@/lib/site";
import { stageOptions } from "@/lib/assessment";
import {
  timingOptions,
  type VillageDraft,
  type VillageStep,
} from "@/lib/village";

const steps = ["Choose support", "Make it yours", "Your village"];
export default function VillageBuilder() {
  const { draft, setDraft, ready, storageAvailable, setNeed, clear, restore } =
    useVillage();
  const router = useRouter();
  const search = useSearchParams();
  const panel = useRef<HTMLDivElement>(null);
  const imported = useRef("");
  const previousStep = useRef<VillageStep | null>(null);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [undo, setUndo] = useState<VillageDraft | null>(null);
  const [arrival, setArrival] = useState("");
  useEffect(() => {
    if (draft.needs.length) {
      setError("");
      setUndo(null);
    }
  }, [draft.needs.length]);
  useEffect(() => {
    if (!ready) return;
    if (previousStep.current !== null && previousStep.current !== draft.step) {
      requestAnimationFrame(() => {
        panel.current?.scrollIntoView({ block: "start", behavior: "instant" });
        panel.current?.focus({ preventScroll: true });
      });
    }
    previousStep.current = draft.step;
  }, [ready, draft.step]);
  const selected = draft.needs.flatMap((slug) => {
    const s = services.find((item) => item.slug === slug);
    return s ? [s] : [];
  });
  useEffect(() => {
    if (!ready) return;
    const need = search.get("need"),
      stage = search.get("stage");
    const token = search.toString();
    if (!token || imported.current === token) return;
    imported.current = token;
    const service = services.find((s) => s.slug === need);
    if (service) {
      setNeed(service.slug, true);
      setArrival(service.slug);
    }
    if (stageOptions.some((s) => s.value === stage))
      setDraft((prev) => ({ ...prev, stage: stage! }));
    router.replace("/get-started", { scroll: false });
  }, [ready, search, router, setDraft, setNeed]);
  function go(step: VillageStep) {
    if (step > 0 && !draft.needs.length) {
      setError("Choose at least one kind of support to build your village.");
      return;
    }
    setError("");
    setDraft((prev) => ({ ...prev, step }));
  }
  function startAgain() {
    setUndo(draft);
    clear();
    setArrival("");
    setCopyMessage("");
    setError("");
  }
  function planText() {
    const stage = stageOptions.find((s) => s.value === draft.stage)?.label;
    const timing = timingOptions.find((s) => s.value === draft.timing)?.label;
    return [
      "MY VILLAGE",
      stage,
      timing,
      "",
      ...selected.flatMap((s) => [
        s.title,
        s.description,
        `${SITE_URL}/services/${s.slug}`,
        ...existingSupport
          .filter((source) => source.serviceSlug === s.slug)
          .map((source) => `${source.name}: ${source.href}`),
        "",
      ]),
      "A personal shortlist of support to explore. Confirm availability and costs directly with each provider.",
    ]
      .filter((v) => v !== undefined)
      .join("\n");
  }
  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(planText());
      setCopyMessage("Your village has been copied.");
    } catch {
      setCopyMessage(
        "Copy isn't available in this browser. Download your village or use Print / save PDF to keep it.",
      );
    }
  }
  function downloadPlan() {
    const url = URL.createObjectURL(
      new Blob([planText()], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-village.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCopyMessage("Your village download is ready.");
  }
  return (
    <div className="village-builder">
      <Container>
        <header className="village-builder-header">
          <div>
            <p className="text-eyebrow uppercase tracking-[.2em] font-semibold text-text-sage mb-4">
              A village of your own
            </p>
            <h1 className="font-heading">
              Your village,
              <br />
              <em className="text-text-sage">taking shape.</em>
            </h1>
          </div>
          <p className="text-sm text-text-muted">
            Choose what would help. Bring it together. Come back and change it
            whenever you need.
          </p>
        </header>
        {!ready ? (
          <p role="status" className="py-12">
            Opening your village…
          </p>
        ) : (
          <>
            <nav className="village-steps" aria-label="Build your village">
              {steps.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => go(i as VillageStep)}
                  aria-current={draft.step === i ? "step" : undefined}
                >
                  <span aria-hidden="true">{i + 1}</span>
                  {label}
                </button>
              ))}
            </nav>
            <div className="village-builder-layout">
              <div
                ref={panel}
                tabIndex={-1}
                className="village-builder-panel"
                aria-label={steps[draft.step]}
              >
                {arrival &&
                  draft.needs.includes(arrival) &&
                  draft.step === 0 && (
                    <p className="village-arrival" role="status">
                      {
                        services.find((service) => service.slug === arrival)
                          ?.title
                      }{" "}
                      is in your village. You can add more below.
                    </p>
                  )}
                {undo && (
                  <div className="village-arrival">
                    Your village was cleared.{" "}
                    <button
                      type="button"
                      className="underline font-semibold"
                      onClick={() => {
                        restore(undo);
                        setUndo(null);
                        setError("");
                      }}
                    >
                      Undo
                    </button>
                  </div>
                )}
                <div key={draft.step} className="village-step-content">
                  {draft.step === 0 && (
                    <>
                      <p className="village-step-eyebrow">
                        01 / Find your starting point
                      </p>
                      <h2 className="font-heading text-3xl mb-3">
                        What would make life lighter?
                      </h2>
                      <p className="text-sm text-text-muted mb-7">
                        Choose one thing, or a few. Nothing is booked or sent.
                      </p>
                      <div
                        className="builder-needs"
                        role="group"
                        aria-label="Support to add to your village"
                      >
                        {services.map((service) => (
                          <button
                            key={service.slug}
                            type="button"
                            aria-pressed={draft.needs.includes(service.slug)}
                            onClick={() =>
                              setNeed(
                                service.slug,
                                !draft.needs.includes(service.slug),
                              )
                            }
                            className={`builder-need village-tone-${service.tone}`}
                          >
                            <span
                              className="builder-need-icon"
                              aria-hidden="true"
                              dangerouslySetInnerHTML={{ __html: service.icon }}
                            />
                            <span>
                              <span className="block font-heading text-lg leading-tight">
                                {service.need}
                              </span>
                              <span className="block text-[11px] text-text-muted mt-1">
                                {service.shortTitle}
                              </span>
                            </span>
                            <span
                              className="builder-need-check"
                              aria-hidden="true"
                            >
                              {draft.needs.includes(service.slug) ? "✓" : "+"}
                            </span>
                          </button>
                        ))}
                      </div>
                      {!selected.length && (
                        <button
                          className="text-sm text-text-sage underline underline-offset-4 mt-6"
                          type="button"
                          onClick={() => {
                            ["food", "cleaning", "community"].forEach((slug) =>
                              setNeed(slug, true),
                            );
                            setError("");
                          }}
                        >
                          Not sure? Show me a few starting points
                        </button>
                      )}
                      <div className="builder-actions">
                        <p className="text-xs text-text-muted">
                          {selected.length} selected
                        </p>
                        <Button onClick={() => go(1)}>
                          Make it mine <span aria-hidden="true">→</span>
                        </Button>
                      </div>
                    </>
                  )}
                  {draft.step === 1 && (
                    <>
                      <p className="village-step-eyebrow">
                        02 / A little context
                      </p>
                      <h2 className="font-heading text-3xl mb-3">
                        Make room for your real life.
                      </h2>
                      <p className="text-sm text-text-muted mb-7">
                        Both questions are optional. These preferences stay with
                        your village; they don&apos;t filter out your choices.
                      </p>
                      <fieldset className="mb-8">
                        <legend className="font-heading text-xl mb-4">
                          What does life look like right now?
                        </legend>
                        <div className="builder-options">
                          {stageOptions.map((option) => (
                            <button
                              type="button"
                              key={option.value}
                              aria-pressed={draft.stage === option.value}
                              onClick={() =>
                                setDraft((prev) => ({
                                  ...prev,
                                  stage:
                                    prev.stage === option.value
                                      ? ""
                                      : option.value,
                                }))
                              }
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend className="font-heading text-xl mb-4">
                          When would a little help be welcome?
                        </legend>
                        <div className="builder-options">
                          {timingOptions.map((option) => (
                            <button
                              type="button"
                              key={option.value}
                              aria-pressed={draft.timing === option.value}
                              onClick={() =>
                                setDraft((prev) => ({
                                  ...prev,
                                  timing:
                                    prev.timing === option.value
                                      ? ""
                                      : option.value,
                                }))
                              }
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <div className="builder-actions">
                        <button
                          type="button"
                          onClick={() => go(0)}
                          className="text-sm text-text-sage underline underline-offset-4"
                        >
                          ← Back
                        </button>
                        <Button onClick={() => go(2)}>
                          See my village <span aria-hidden="true">→</span>
                        </Button>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-text-muted underline underline-offset-4 mt-5"
                        onClick={() => go(2)}
                      >
                        Skip these questions
                      </button>
                    </>
                  )}
                  {draft.step === 2 && (
                    <>
                      <div className="village-plan-heading">
                        <p className="village-step-eyebrow">
                          03 / Your village, taking shape
                        </p>
                        <h2 className="font-heading text-3xl mb-3">
                          This is your starting village.
                        </h2>
                        <p className="text-sm text-text-muted">
                          Your choices, brought together. Explore the services
                          below and take the next step at your pace.
                        </p>
                      </div>
                      {(draft.stage || draft.timing) && (
                        <div className="flex flex-wrap gap-2 my-5">
                          {[
                            stageOptions.find((s) => s.value === draft.stage)
                              ?.label,
                            timingOptions.find((s) => s.value === draft.timing)
                              ?.label,
                          ]
                            .filter(Boolean)
                            .map((label) => (
                              <span key={label} className="village-context-tag">
                                {label}
                              </span>
                            ))}
                        </div>
                      )}
                      {draft.timing === "asap" && (
                        <p className="text-sm text-text-body bg-surface p-4 my-5 rounded-xl">
                          For support now, contact the independent services
                          directly to check availability. A Village enquiry does
                          not arrange immediate care.
                        </p>
                      )}
                      <div className="village-plan-list">
                        {selected.map((service) => (
                          <article
                            key={service.slug}
                            className="village-plan-item"
                          >
                            <div className="flex items-start gap-4">
                              <span
                                className={`plan-icon village-tone-${service.tone}`}
                                aria-hidden="true"
                                dangerouslySetInnerHTML={{
                                  __html: service.icon,
                                }}
                              />
                              <div className="flex-1">
                                <h3 className="font-heading text-2xl">
                                  {service.title}
                                </h3>
                                <p className="text-sm text-text-muted mt-2">
                                  {service.tagline}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="plan-remove"
                                aria-label={`Remove ${service.title.toLowerCase()} from my plan`}
                                onClick={() => setNeed(service.slug, false)}
                              >
                                ×
                              </button>
                            </div>
                            <ServiceSources slug={service.slug} compact />
                            <Link
                              href={`/services/${service.slug}`}
                              className="text-sm text-text-sage underline underline-offset-4"
                            >
                              More about this support{" "}
                              <span aria-hidden="true">→</span>
                            </Link>
                          </article>
                        ))}
                      </div>
                      <p className="text-xs text-text-muted mt-5">
                        These services are independent of Village. Confirm
                        qualifications, suitability, availability and costs
                        directly.
                      </p>
                      <div className="flex flex-wrap gap-3 mt-7 village-export">
                        <Button variant="secondary" onClick={copyPlan}>
                          Copy my village
                        </Button>
                        <Button variant="secondary" onClick={downloadPlan}>
                          Download my village
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => window.print()}
                        >
                          Print / save PDF
                        </Button>
                        <button
                          type="button"
                          className="text-sm underline text-text-sage px-2"
                          onClick={() => go(0)}
                        >
                          Edit my choices
                        </button>
                      </div>
                      <p role="status" className="text-sm text-text-sage mt-3">
                        {copyMessage}
                      </p>
                      <VillageEnquiry />
                    </>
                  )}
                </div>
                {error && (
                  <p role="alert" className="text-sm text-red-800 mt-4">
                    {error}
                  </p>
                )}
                <div className="village-draft-note">
                  <p>
                    {storageAvailable
                      ? "Kept in this browser tab, including after a refresh. Contact details are never saved."
                      : "Your browser is blocking storage. Your village will stay while you browse, but a refresh may clear it."}{" "}
                    <Link href="/privacy" className="underline">
                      Privacy
                    </Link>
                  </p>
                  {selected.length > 0 && (
                    <button
                      onClick={startAgain}
                      type="button"
                      className="underline shrink-0"
                    >
                      Clear village
                    </button>
                  )}
                </div>
              </div>
              <aside className="village-builder-aside">
                <VillageScene />
                <div className="village-scene-note">
                  <p className="font-heading text-xl mb-2">
                    {draft.needs.length
                      ? "A village that grows with you."
                      : "You don’t have to do it all."}
                  </p>
                  <p className="text-sm text-text-muted">
                    Tap a circle to add or remove support. Your choices follow
                    you as you explore the site.
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
