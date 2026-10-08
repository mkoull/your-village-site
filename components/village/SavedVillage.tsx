"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import { services } from "@/content/services";
import { existingSupport } from "@/content/existing-support";
import VillageMark from "@/components/ui/VillageMark";
import { useVillage } from "./VillageProvider";
import VillageScene from "./VillageScene";
import ServiceSources from "./ServiceSources";
import VillageExports from "./VillageExports";
import VillageEnquiry from "./VillageEnquiry";
import AppEntry from "./AppEntry";
import VillageStorageControl from "./VillageStorageControl";
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
    remembered,
  } = useVillage();
  const [undo, setUndo] = useState<{
    draft: VillageDraft;
    slug?: string;
    remembered?: boolean;
  } | null>(null);
  const undoButton = useRef<HTMLButtonElement>(null);
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
  const nextSupport = selected.find(
    (service) => (draft.progress[service.slug] || "exploring") === "exploring",
  );
  const nextSource = existingSupport.find(
    (source) => source.serviceSlug === nextSupport?.slug,
  );
  const displayed = undo?.slug
    ? undo.draft.needs.flatMap((slug) =>
        services.filter(
          (service) =>
            service.slug === slug &&
            (slug === undo.slug || visible.some((item) => item.slug === slug)),
        ),
      )
    : visible;
  function focusElement(element: HTMLElement | null | undefined) {
    element?.scrollIntoView({ behavior: "instant", block: "nearest" });
    element?.focus({ preventScroll: true });
  }
  function undoChange() {
    if (!undo) return;
    const slug = undo.slug;
    restore(undo.draft, undo.remembered);
    setUndo(null);
    setFilter("all");
    requestAnimationFrame(() =>
      focusElement(slug ? cards.current[slug] : heading.current),
    );
  }
  const undoNotice = undo && (
    <div className="village-arrival village-undo-notice" role="status">
      <span>
        {undo.slug
          ? `${services.find((service) => service.slug === undo.slug)?.title} removed.`
          : "Your village has been cleared."}
      </span>
      <button
        ref={undoButton}
        type="button"
        className="underline font-semibold"
        onClick={undoChange}
      >
        Undo
      </button>
    </div>
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
    setUndo({ draft, slug });
    setNeed(slug, false);
    setActive("");
    requestAnimationFrame(() => focusElement(undoButton.current));
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
            Your saved support, with service links and a place to keep track.
            Take the next step at your own pace.
          </p>
        </header>
        <AppEntry />
        {!ready ? (
          <p role="status" className="py-12">
            Opening your village…
          </p>
        ) : (
          <>
            {!selected.length && undoNotice}
            {!selected.length ? (
              <div className="village-empty-saved">
                <VillageMark className="village-empty-mark" />
                {remembered && <VillageStorageControl />}
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
                <div className="village-empty-actions">
                  <Button href="/get-started">
                    Choose my support <span aria-hidden="true">→</span>
                  </Button>
                  <Link
                    href="/services"
                    className="text-sm underline text-text-sage inline-flex items-center min-h-11"
                  >
                    Browse services first
                  </Link>
                </div>
                <div className="village-empty-starts">
                  <p>A little inspiration</p>
                  {services
                    .filter((service) =>
                      ["food", "sleep", "community"].includes(service.slug),
                    )
                    .map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                      >
                        <span
                          className="plan-icon"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: service.icon }}
                        />
                        <span>{service.need}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                </div>
              </div>
            ) : (
              <>
                <div className="village-saved-toolbar">
                  <div>
                    <p>
                      {selected.length}{" "}
                      {selected.length === 1 ? "kind" : "kinds"} of support
                      saved · {counts[2].count} in place
                    </p>
                    <p className="village-save-explanation">
                      {remembered
                        ? "Remembered on this device."
                        : storageAvailable
                          ? "Saved in this browser tab."
                          : "Browser storage is unavailable."}{" "}
                      <a
                        href="#keep-my-village"
                        className="underline underline-offset-4"
                      >
                        Keep my village for later
                      </a>
                    </p>
                  </div>
                  <Link
                    href="/get-started"
                    className="text-sm text-text-sage underline underline-offset-4"
                  >
                    Edit my choices <ArrowUpRight />
                  </Link>
                </div>
                <section
                  className="village-next-action"
                  aria-labelledby="village-next-action-heading"
                >
                  <div>
                    <p className="village-step-eyebrow">One small next step</p>
                    <h2
                      id="village-next-action-heading"
                      className="font-heading"
                    >
                      {nextSupport
                        ? `Start with ${nextSupport.shortTitle.toLowerCase()}.`
                        : "Keep your support close."}
                    </h2>
                    <p>
                      {nextSource
                        ? nextSource.nextStep
                        : counts[1].count
                          ? "Made contact? Check back with the service when you’re ready, then update your progress when support is in place."
                          : "Your saved support is marked as in place. You can change your progress or add something else whenever you need."}
                    </p>
                  </div>
                  {nextSupport ? (
                    <button
                      type="button"
                      onClick={() => focusSupport(nextSupport.slug)}
                    >
                      See {nextSupport.shortTitle.toLowerCase()} support{" "}
                      <span aria-hidden="true">↓</span>
                    </button>
                  ) : (
                    <Link href="/services">
                      Explore more support <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </section>
                <div className="village-builder-layout">
                  <section
                    className="village-builder-panel"
                    aria-labelledby="saved-support-heading"
                  >
                    <h2
                      ref={heading}
                      tabIndex={-1}
                      id="saved-support-heading"
                      className="font-heading text-3xl mb-3 scroll-mt-28"
                    >
                      Your saved support.
                    </h2>
                    <p className="text-sm text-text-muted mb-5">
                      Explore each service, then update your progress as you go.
                      These are your own notes, not booking confirmations.
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
                          onClick={() => {
                            setFilter("all");
                            setUndo(null);
                          }}
                        >
                          All ({selected.length})
                        </button>
                        {counts.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={filter === option.value}
                            onClick={() => {
                              setFilter(option.value);
                              setUndo(null);
                            }}
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
                      {displayed.map((service) =>
                        undo?.slug === service.slug ? (
                          <div key={service.slug}>{undoNotice}</div>
                        ) : (
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
                                dangerouslySetInnerHTML={{
                                  __html: service.icon,
                                }}
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
                                      focusElement(heading.current),
                                    );
                                }}
                              >
                                {supportProgressOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
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
                        ),
                      )}
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
                          onClick={() => {
                            setFilter("all");
                            setUndo(null);
                            requestAnimationFrame(() =>
                              focusElement(heading.current),
                            );
                          }}
                        >
                          Show all my support →
                        </button>
                      </div>
                    )}
                    <VillageExports
                      onPrint={() => {
                        setFilter("all");
                        setUndo(null);
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
                    {remembered
                      ? "Your choices and progress are saved in this browser on this device. Clear village removes the saved copy too."
                      : storageAvailable
                        ? "Your choices and progress stay in this tab. Choose Remember to return later, or download a copy."
                        : "Storage is blocked. Download a copy before refreshing or closing the tab."}{" "}
                    <Link href="/privacy" className="underline">
                      Privacy
                    </Link>
                  </p>
                  <button
                    type="button"
                    className="underline shrink-0"
                    onClick={() => {
                      if (!clear()) return;
                      setUndo({ draft, remembered });
                      setFilter("all");
                      requestAnimationFrame(() =>
                        focusElement(undoButton.current),
                      );
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
