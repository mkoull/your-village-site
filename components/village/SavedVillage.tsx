"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { services } from "@/content/services";
import { useVillage } from "./VillageProvider";
import VillageScene from "./VillageScene";
import ServiceSources from "./ServiceSources";
import VillageExports from "./VillageExports";
import VillageEnquiry from "./VillageEnquiry";
import AppEntry from "./AppEntry";
import {
  supportProgressOptions,
  type SupportProgress,
  type VillageDraft,
} from "@/lib/village";

export default function SavedVillage() {
  const {
    draft,
    ready,
    setNeed,
    setProgress,
    clear,
    restore,
    storageAvailable,
  } = useVillage();
  const [undo, setUndo] = useState<VillageDraft | null>(null);
  const [filter, setFilter] = useState<"all" | SupportProgress>("all");
  const [active, setActive] = useState("");
  const cards = useRef<Record<string, HTMLElement | null>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const selected = draft.needs.flatMap((slug) =>
    services.filter((service) => service.slug === slug),
  );
  const counts = supportProgressOptions.map((option) => ({
    ...option,
    count: selected.filter(
      (service) =>
        (draft.progress[service.slug] || "exploring") === option.value,
    ).length,
  }));
  const visible = selected.filter(
    (service) =>
      filter === "all" ||
      (draft.progress[service.slug] || "exploring") === filter,
  );
  function focusSupport(slug: string) {
    setFilter("all");
    setActive(slug);
    setUndo(null);
    requestAnimationFrame(() => {
      cards.current[slug]?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
      cards.current[slug]?.focus({ preventScroll: true });
    });
  }
  function remove(slug: string) {
    setUndo(draft);
    setNeed(slug, false);
    setActive("");
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  }
  return (
    <div
      className="village-builder village-saved-page"
      data-step="2"
      data-saved-view="true"
    >
      <Container>
        <header className="village-builder-header">
          <div>
            <p className="village-step-eyebrow">
              My village · Your support, together
            </p>
            <h1 className="font-heading">
              Your village.
              <br />
              <em className="text-text-sage">Your next step.</em>
            </h1>
          </div>
          <p className="text-sm text-text-muted">
            Open a service to explore your options and get in touch directly.
            Then keep track of where you’re up to, at your own pace.
          </p>
        </header>
        <AppEntry />
        {!ready ? (
          <p role="status" className="py-12">
            Opening your village…
          </p>
        ) : (
          <>
            {undo && (
              <div className="village-arrival" role="status">
                Your choices were updated.{" "}
                <button
                  type="button"
                  className="underline font-semibold"
                  onClick={() => {
                    restore(undo);
                    setUndo(null);
                    setFilter("all");
                  }}
                >
                  Undo
                </button>
              </div>
            )}
            {!selected.length ? (
              <div className="village-empty-saved">
                <h2
                  ref={heading}
                  tabIndex={-1}
                  className="font-heading text-3xl mb-4"
                >
                  Your village starts with you.
                </h2>
                <p className="text-sm text-text-muted mb-6">
                  Choose what would help, and we’ll bring the relevant service
                  links here. You can explore them, make contact and keep track
                  of your support.
                </p>
                <Button href="/get-started">
                  Choose my support <span aria-hidden="true">→</span>
                </Button>
                <Link
                  href="/services"
                  className="text-sm underline text-text-sage inline-block ml-5 mt-4"
                >
                  Browse services first
                </Link>
              </div>
            ) : (
              <>
                <div className="village-saved-toolbar">
                  <p>
                    {selected.length} {selected.length === 1 ? "kind" : "kinds"}{" "}
                    of support saved · {counts[2].count} in place
                  </p>
                  <Link
                    href="/get-started"
                    className="text-sm text-text-sage underline underline-offset-4"
                  >
                    Edit my choices <span aria-hidden="true">↗</span>
                  </Link>
                </div>
                <div className="village-builder-layout">
                  <section
                    className="village-builder-panel"
                    aria-labelledby="saved-support-heading"
                  >
                    <h2
                      ref={heading}
                      tabIndex={-1}
                      id="saved-support-heading"
                      className="font-heading text-3xl mb-3"
                    >
                      Services to explore.
                    </h2>
                    <p className="text-sm text-text-muted mb-5">
                      Start with one. Make contact on their website, then update
                      your progress here.
                    </p>
                    <details className="village-filter-tools">
                      <summary>
                        Filter saved support{" "}
                        {filter !== "all" && (
                          <span>
                            ·{" "}
                            {
                              supportProgressOptions.find(
                                (option) => option.value === filter,
                              )?.label
                            }
                          </span>
                        )}
                      </summary>
                      <div
                        className="village-progress-filters builder-options"
                        role="group"
                        aria-label="Filter my support"
                      >
                        <button
                          type="button"
                          aria-pressed={filter === "all"}
                          onClick={() => setFilter("all")}
                        >
                          All ({selected.length})
                        </button>
                        {counts.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={filter === option.value}
                            onClick={() => setFilter(option.value)}
                          >
                            {option.value === "contacted"
                              ? "Contact made"
                              : option.label}{" "}
                            ({option.count})
                          </button>
                        ))}
                      </div>
                    </details>
                    <p role="status" className="text-xs text-text-muted my-4">
                      Showing {visible.length} of {selected.length} saved{" "}
                      {selected.length === 1 ? "category" : "categories"}
                    </p>
                    <div className="village-plan-list">
                      {visible.map((service) => (
                        <article
                          key={service.slug}
                          id={`support-${service.slug}`}
                          tabIndex={-1}
                          ref={(element) => {
                            cards.current[service.slug] = element;
                          }}
                          data-active={active === service.slug}
                          className={`village-plan-item village-tone-${service.tone}`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className="plan-icon"
                              aria-hidden="true"
                              dangerouslySetInnerHTML={{ __html: service.icon }}
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-heading text-2xl">
                                {service.title}
                              </h3>
                              <p className="text-sm text-text-muted mt-1">
                                {service.tagline}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="plan-remove"
                              aria-label={`Remove ${service.title.toLowerCase()} from my village`}
                              onClick={() => remove(service.slug)}
                            >
                              ×
                            </button>
                          </div>
                          <ServiceSources slug={service.slug} compact />
                          <div className="village-progress-control">
                            <label
                              htmlFor={`progress-${service.slug}`}
                              className="text-sm font-medium"
                            >
                              My progress
                            </label>
                            <select
                              id={`progress-${service.slug}`}
                              value={
                                draft.progress[service.slug] || "exploring"
                              }
                              onChange={(event) => {
                                setProgress(
                                  service.slug,
                                  event.target.value as SupportProgress,
                                );
                                setUndo(null);
                                if (filter !== "all")
                                  requestAnimationFrame(() =>
                                    heading.current?.focus({
                                      preventScroll: true,
                                    }),
                                  );
                              }}
                            >
                              {supportProgressOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <Link
                            href={`/services/${service.slug}`}
                            className="inline-block text-sm underline underline-offset-4 text-text-sage mt-5"
                          >
                            More about {service.shortTitle.toLowerCase()}{" "}
                            <span aria-hidden="true">→</span>
                          </Link>
                        </article>
                      ))}
                    </div>
                    {!visible.length && (
                      <div className="village-empty-filter">
                        <h3 className="font-heading text-2xl mb-3">
                          Nothing here just yet.
                        </h3>
                        <p className="text-sm text-text-muted mb-5">
                          Update your progress on a support card whenever you
                          take the next step.
                        </p>
                        <button
                          type="button"
                          className="underline text-text-sage"
                          onClick={() => setFilter("all")}
                        >
                          Show all my support →
                        </button>
                      </div>
                    )}
                    <VillageExports
                      onPrint={() => {
                        setFilter("all");
                        requestAnimationFrame(() => window.print());
                      }}
                    />
                    <VillageEnquiry />
                  </section>
                  <aside className="village-builder-aside">
                    <VillageScene
                      review
                      onReview={focusSupport}
                      activeSlug={active}
                    />
                    <Link href="/get-started" className="village-map-next">
                      Add another kind of support{" "}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </aside>
                </div>
                <div className="village-draft-note">
                  <p>
                    {storageAvailable
                      ? "Your choices and progress stay in this browser tab, including after a refresh. Download a copy before closing the tab."
                      : "Storage is blocked. Download a copy before refreshing or closing the tab."}{" "}
                    <Link href="/privacy" className="underline">
                      Privacy
                    </Link>
                  </p>
                  <button
                    type="button"
                    className="underline shrink-0"
                    onClick={() => {
                      setUndo(draft);
                      clear();
                      setFilter("all");
                      requestAnimationFrame(() => {
                        heading.current?.scrollIntoView({
                          block: "center",
                          behavior: "instant",
                        });
                        heading.current?.focus({ preventScroll: true });
                      });
                    }}
                  >
                    Clear village
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
