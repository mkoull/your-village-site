import Link from "next/link";
import { services } from "@/content/services";
import VillageMark from "@/components/ui/VillageMark";

// Clockwise, with room for both the icon and its label on small screens.
const positions = [
  [50, 10],
  [78, 22],
  [89, 50],
  [78, 78],
  [50, 90],
  [22, 78],
  [11, 50],
  [22, 22],
];

export default function VillageMap() {
  return (
    <figure className="village-map-wrap">
      <div
        className="village-map"
        role="group"
        aria-label="Explore your village of support"
      >
        <svg
          className="village-map-lines"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="39"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.2"
          />
          <circle
            cx="50"
            cy="50"
            r="29"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.15"
            strokeDasharray="0.5 1.6"
          />
          {positions.map(([x, y], i) => (
            <path
              key={i}
              d={`M50 50 Q${50 + (x - 50) * 0.7} ${50 + (y - 50) * 0.25} ${x} ${y}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.2"
            />
          ))}
        </svg>
        <div className="village-map-centre">
          <VillageMark className="w-10 h-10 mb-2 text-text-sage" />
          <span className="font-heading">Your village</span>
          <span className="village-map-centre-caption">Built around you</span>
        </div>
        {services.map((service, i) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            aria-label={`Explore ${service.title.toLowerCase()}`}
            className={`village-node village-tone-${service.tone}`}
            style={{ left: `${positions[i][0]}%`, top: `${positions[i][1]}%` }}
          >
            <span
              className="village-node-icon"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: service.icon }}
            />
            <span className="village-node-label">{service.shortTitle}</span>
          </Link>
        ))}
      </div>
      <figcaption className="text-center text-xs text-text-muted mt-4">
        A little help, all around you. <span aria-hidden="true">↗</span>
      </figcaption>
    </figure>
  );
}
