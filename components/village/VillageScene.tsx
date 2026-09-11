"use client";
import { useId, useState, type CSSProperties } from "react";
import Link from "next/link";
import { services } from "@/content/services";
import VillageMark from "@/components/ui/VillageMark";
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
  const [preview, setPreview] = useState("");
  const previewService = services.find(
    (service) => service.slug === preview && draft.needs.includes(preview),
  );
  return (
    <figure
      className={`village-lights ${home ? "village-lights-home" : ""}`}
      data-has-support={count > 0}
      style={{ "--village-warmth": count / services.length } as CSSProperties}
    >
      <div className="village-lights-atmosphere" aria-hidden="true" />
      <div className="village-lights-heading">
        <span aria-hidden="true" className="village-little-star">
          ✧
        </span>
        A little help, all around you
        <span aria-hidden="true" className="village-little-star">
          ✧
        </span>
      </div>
      <div
        className="village-light-map"
        role="group"
        aria-label="Your interactive village"
        aria-describedby={captionId}
      >
        <svg
          viewBox="0 0 100 100"
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
          <span>at the heart of it</span>
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
                setPreview(selected ? "" : service.slug);
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
                <span className="village-light-check">
                  {selected ? "✓" : "+"}
                </span>
              </span>
              <span className="village-light-label">{service.shortTitle}</span>
            </button>
          );
        })}
      </div>
      <figcaption id={captionId} className="village-light-caption">
        <span className="village-light-caption-title font-heading">
          {count
            ? `${count} ${count === 1 ? "little light" : "little lights"}. Your own village.`
            : "Every village starts with a little light."}
        </span>
        <span>
          {review
            ? "Tap a light to explore it. Unlit circles add support."
            : "Tap a circle to add support. Tap again to remove it."}
        </span>
      </figcaption>
      {home && (
        <div className="village-map-feedback">
          {previewService ? (
            <>
              <p role="status">
                <strong>{previewService.title} added.</strong>{" "}
                {previewService.tagline}.
              </p>
              <Link href={`/services/${previewService.slug}`}>
                Explore {previewService.shortTitle.toLowerCase()}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </>
          ) : (
            <p>Choose a circle to start finding your support.</p>
          )}
          {count > 0 && (
            <Link href="/my-village">
              See my village ({count}) <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      )}
    </figure>
  );
}
