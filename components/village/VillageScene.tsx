"use client";
import { useId, useState, type CSSProperties } from "react";
import Link from "next/link";
import { services } from "@/content/services";
import VillageMark from "@/components/ui/VillageMark";
import VillageInteractionHint from "@/components/ui/VillageInteractionHint";
import { useVillage } from "./VillageProvider";

/** One interactive scene and one saved village, wherever someone starts. */
export default function VillageScene({
  home = false,
  review = false,
  onReview,
  activeSlug,
}: {
  home?: boolean;
  review?: boolean;
  onReview?: (slug: string) => void;
  activeSlug?: string;
}) {
  const { draft, setNeed, ready } = useVillage();
  const captionId = useId();
  const count = draft.needs.length;
  const [lastChange, setLastChange] = useState<{
    slug: string;
    added: boolean;
  } | null>(null);
  const recentService = services.find(
    (service) =>
      service.slug === lastChange?.slug &&
      draft.needs.includes(service.slug) === lastChange.added,
  );
  return (
    <figure
      className={`village-lights ${home ? "village-lights-home" : ""}`}
      data-has-support={count > 0}
      style={{ "--village-warmth": count / services.length } as CSSProperties}
    >
      <div className="village-lights-atmosphere" aria-hidden="true" />
      <div className="village-lights-heading">
        <p className="village-lights-eyebrow">A little help, all around you</p>
        <h2 className="village-lights-title">
          {review ? "Your circle of support." : "What would help you today?"}
        </h2>
        <VillageInteractionHint id={`${captionId}-hint`}>
          {review
            ? "a light to explore your support."
            : "a light to add it to your village."}
        </VillageInteractionHint>
      </div>
      <div
        className="village-light-map"
        role="group"
        aria-label="Your interactive village"
        aria-describedby={`${captionId}-hint ${captionId}`}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="village-light-paths"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="37" className="village-light-orbit" />
          <circle
            cx="50"
            cy="50"
            r="26"
            className="village-light-orbit village-light-orbit-inner"
          />
          {services.map((service, i) => {
            const angle = (i * 2 * Math.PI) / services.length - Math.PI / 2;
            const x = 50 + 37 * Math.cos(angle),
              y = 50 + 37 * Math.sin(angle);
            return (
              <path
                key={service.slug}
                pathLength="1"
                d={`M${x} ${y} Q${50 + (x - 50) * 0.2} ${50 + (y - 50) * 0.8} 50 50`}
                className={draft.needs.includes(service.slug) ? "is-lit" : ""}
              />
            );
          })}
        </svg>
        <div className="village-light-heart" aria-hidden="true">
          <VillageMark className="village-light-mark" />
          <span className="font-heading">You</span>
          <span>
            {count
              ? `${count} ${count === 1 ? "light" : "lights"} on`
              : "at the heart of it"}
          </span>
        </div>
        {services.map((service, i) => {
          const angle = (i * 2 * Math.PI) / services.length - Math.PI / 2;
          const selected = draft.needs.includes(service.slug);
          return (
            <button
              key={service.slug}
              type="button"
              disabled={!ready}
              aria-label={
                review
                  ? `${selected ? "View" : "Add"} ${service.shortTitle.toLowerCase()} ${selected ? "in" : "to"} my village`
                  : `${selected ? "Remove" : "Add"} ${service.shortTitle.toLowerCase()} ${selected ? "from" : "to"} the village map`
              }
              aria-pressed={review ? undefined : selected}
              aria-current={
                review && activeSlug === service.slug ? "true" : undefined
              }
              onClick={() => {
                if (review) {
                  if (!selected) setNeed(service.slug, true);
                  onReview?.(service.slug);
                  return;
                }
                setNeed(service.slug, !selected);
                setLastChange({ slug: service.slug, added: !selected });
              }}
              style={{
                left: `${50 + 37 * Math.cos(angle)}%`,
                top: `${50 + 37 * Math.sin(angle)}%`,
              }}
              className={`village-light-node ${selected ? "is-lit" : ""}`}
            >
              <span className="village-light-orb" aria-hidden="true">
                <span className="village-light-ripple" />
                <span
                  className="village-light-icon"
                  dangerouslySetInnerHTML={{ __html: service.icon }}
                />
                <span className="village-light-label">
                  {service.shortTitle}
                </span>
              </span>
              <span className="village-light-action" aria-hidden="true">
                <span className="village-light-action-icon">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d={
                        selected
                          ? review
                            ? "M4 8h8M8 4l4 4-4 4"
                            : "m4 8 3 3 5-6"
                          : "M8 4v8M4 8h8"
                      }
                    />
                  </svg>
                </span>
                <span>{selected ? (review ? "Open" : "Added") : "Add"}</span>
              </span>
            </button>
          );
        })}
      </div>
      <figcaption id={captionId} className="village-light-caption">
        <span className="village-light-caption-title font-heading">
          {recentService
            ? `${recentService.shortTitle} ${lastChange?.added ? "added to" : "removed from"} your village.`
            : count
              ? `${count} ${count === 1 ? "little light" : "little lights"}. Your own village.`
              : "Your village starts with you."}
        </span>
        <span>
          {review
            ? "Open your saved support, or add something new."
            : count
              ? "Select an added light again to remove it."
              : "Choose one kind of help, or a few. It’s up to you."}
        </span>
      </figcaption>
      {home && (
        <div className="village-light-next">
          <Link
            href={count ? "/my-village" : "/services"}
            data-ready={count > 0}
          >
            <span>{count ? "Explore my village" : "Browse support first"}</span>
            <span className="village-light-next-end">
              {count > 0 && (
                <span className="village-light-next-count">
                  {count}
                  <span className="sr-only"> selected services</span>
                </span>
              )}
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      )}
    </figure>
  );
}
