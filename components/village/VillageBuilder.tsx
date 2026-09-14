"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useVillage } from "./VillageProvider";
import VillageScene from "./VillageScene";
import SavedVillage from "./SavedVillage";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { services } from "@/content/services";
import { stageOptions } from "@/lib/assessment";

export default function VillageBuilder({
  savedView = false,
}: {
  savedView?: boolean;
}) {
  return savedView ? <SavedVillage /> : <ChooseSupport />;
}

function ChooseSupport() {
  const { draft, setDraft, ready, setNeed, storageAvailable } = useVillage();
  const router = useRouter();
  const search = useSearchParams();
  const imported = useRef("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!ready) return;
    const token = search.toString();
    if (!token || imported.current === token) return;
    imported.current = token;
    const need = search.get("need"),
      stage = search.get("stage");
    if (services.some((service) => service.slug === need)) setNeed(need!, true);
    if (stageOptions.some((option) => option.value === stage))
      setDraft((previous) => ({ ...previous, stage: stage! }));
    router.replace("/get-started", { scroll: false });
  }, [ready, search, router, setNeed, setDraft]);
  useEffect(() => {
    if (draft.needs.length) setError("");
  }, [draft.needs.length]);

  return (
    <div className="village-builder village-chooser" data-step="0">
      <Container>
        <header className="village-builder-header">
          <div>
            <p className="village-step-eyebrow">
              Build your village · Choose support
            </p>
            <h1 className="font-heading">
              What would make
              <br />
              <em className="text-text-sage">life lighter?</em>
            </h1>
          </div>
          <p className="text-sm text-text-muted">
            Choose one kind of help, or a few. Next, you’ll see services to
            explore and a place to keep track. Your choices stay in this tab; no
            contact details needed.
          </p>
        </header>
        {!ready ? (
          <p role="status" className="py-12">
            Opening your village…
          </p>
        ) : (
          <div className="village-builder-layout">
            <section
              className="village-builder-panel"
              aria-labelledby="choose-support-heading"
            >
              <h2
                id="choose-support-heading"
                tabIndex={-1}
                className="font-heading text-3xl mb-3 scroll-mt-24"
              >
                Start with what you need.
              </h2>
              <p className="text-sm text-text-muted mb-6">
                Each choice lights up your village. Tap again to remove it.
              </p>
              {error && (
                <p role="alert" className="text-sm text-red-800 my-4">
                  {error}
                </p>
              )}
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
                      setNeed(service.slug, !draft.needs.includes(service.slug))
                    }
                    className={`builder-need village-tone-${service.tone}`}
                  >
                    <span
                      className="builder-need-icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: service.icon }}
                    />
                    <span>
                      <span className="block font-heading text-xl">
                        {service.need}
                      </span>
                      <span className="block text-xs text-text-muted mt-1">
                        {service.title}
                      </span>
                    </span>
                    <span className="builder-need-check" aria-hidden="true">
                      {draft.needs.includes(service.slug) ? "✓" : "+"}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-text-muted mt-6">
                Want to understand the options first?{" "}
                <Link
                  href="/services"
                  className="underline text-text-sage underline-offset-4"
                >
                  Explore all support →
                </Link>
              </p>
              <div className="chooser-next">
                <p role="status" className="text-sm">
                  {draft.needs.length
                    ? `${draft.needs.length} ${draft.needs.length === 1 ? "kind" : "kinds"} of support selected`
                    : "Choose a little support to get started"}
                </p>
                <Button
                  onClick={() => {
                    if (!draft.needs.length) {
                      setError(
                        "Choose at least one kind of support below, then see the services available to explore.",
                      );
                      requestAnimationFrame(() => {
                        const heading = document.getElementById(
                          "choose-support-heading",
                        );
                        heading?.scrollIntoView({
                          block: "start",
                          behavior: "instant",
                        });
                        heading?.focus({ preventScroll: true });
                      });
                      return;
                    }
                    router.push("/my-village");
                  }}
                >
                  See my support options <span aria-hidden="true">→</span>
                </Button>
              </div>
              <p className="village-draft-note">
                {storageAvailable
                  ? "Your choices stay in this tab as you browse and refresh."
                  : "Storage is blocked in this browser. A refresh may clear your choices."}{" "}
                <Link href="/privacy" className="underline">
                  Privacy
                </Link>
              </p>
            </section>
            <aside className="village-builder-aside">
              <VillageScene />
              <p className="text-sm text-text-muted mt-5 text-center">
                Choose support here or in the list. Both build the same village.
              </p>
            </aside>
          </div>
        )}
      </Container>
    </div>
  );
}
