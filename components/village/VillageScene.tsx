"use client";
import { useId, type CSSProperties } from "react";
import { services } from "@/content/services";
import VillageMark from "@/components/ui/VillageMark";
import { useVillage } from "./VillageProvider";

/** One interactive scene and one saved village, wherever someone starts. */
export default function VillageScene({ home = false }: { home?: boolean }) {
  const { draft, setNeed, ready } = useVillage();
  const captionId = useId();
  const count = draft.needs.length;
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
              aria-label={`${selected ? "Remove" : "Add"} ${service.shortTitle.toLowerCase()} ${selected ? "from" : "to"} the village map`}
              aria-pressed={selected}
              onClick={() => setNeed(service.slug, !selected)}
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
        <span>Tap a circle to add support. Tap again to let it go.</span>
      </figcaption>
    </figure>
  );
}
