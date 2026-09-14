import VillageMark from "./VillageMark";

export default function VillageBrand({
  inverse = false,
  variant = "default",
}: {
  inverse?: boolean;
  variant?: "default" | "header";
}) {
  return (
    <span
      className={`village-brand ${inverse ? "village-brand-inverse" : ""} ${variant === "header" ? "village-brand-header" : ""}`}
      role="img"
      aria-label="Your Village"
    >
      <span className="village-brand-symbol" aria-hidden="true">
        <VillageMark />
      </span>
      <span className="village-brand-wordmark" aria-hidden="true">
        <span className="village-brand-your">your</span>
        <span className="village-brand-name">
          village
          {variant === "default" && (
            <span className="village-brand-period">.</span>
          )}
        </span>
      </span>
    </span>
  );
}
