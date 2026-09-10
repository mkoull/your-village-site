"use client";
import { services } from "@/content/services";
import VillageMark from "@/components/ui/VillageMark";
import { useVillage } from "./VillageProvider";

export default function VillageScene() {
  const { draft, setNeed } = useVillage();
  return (
    <figure className="village-scene">
      <div className="village-scene-sky" aria-hidden="true" />
      <p className="village-scene-label">A little help, all around you</p>
      <div
        className="village-scene-map"
        role="group"
        aria-label="Your interactive village"
      >
        <svg
          viewBox="0 0 100 100"
          className="village-scene-lines"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="50" r="27" strokeDasharray=".6 2" />
          {services.map((service, i) => {
            const angle = (i * 2 * Math.PI) / services.length - Math.PI / 2;
            return (
              <line
                key={service.slug}
                x1="50"
                y1="50"
                x2={50 + 38 * Math.cos(angle)}
                y2={50 + 38 * Math.sin(angle)}
                className={
                  draft.needs.includes(service.slug) ? "is-selected" : ""
                }
              />
            );
          })}
        </svg>
        <div className="village-scene-centre">
          <VillageMark className="w-8 h-8 text-text-sage mb-2" />
          <span className="font-heading">Your village</span>
          <span className="text-[10px] text-text-muted">
            {draft.needs.length
              ? `${draft.needs.length} ${draft.needs.length === 1 ? "piece" : "pieces"} of support`
              : "Start with one thing"}
          </span>
        </div>
        {services.map((service, i) => {
          const angle = (i * 2 * Math.PI) / services.length - Math.PI / 2;
          const selected = draft.needs.includes(service.slug);
          return (
            <button
              key={service.slug}
              type="button"
              aria-label={`${selected ? "Remove" : "Add"} ${service.shortTitle.toLowerCase()} ${selected ? "from" : "to"} the village map`}
              aria-pressed={selected}
              onClick={() => setNeed(service.slug, !selected)}
              style={{
                left: `${50 + 38 * Math.cos(angle)}%`,
                top: `${50 + 38 * Math.sin(angle)}%`,
              }}
              className={`village-scene-node village-tone-${service.tone} ${selected ? "is-selected" : ""}`}
            >
              <span
                className="village-scene-node-icon"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: service.icon }}
              />
              <span>{service.shortTitle}</span>
              {selected && (
                <span className="village-scene-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
      <figcaption>
        There&apos;s no perfect mix. Just what feels right for you.
      </figcaption>
    </figure>
  );
}
