import { existingSupport } from "@/content/existing-support";

export default function ServiceSources({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  const sources = existingSupport.filter((item) => item.serviceSlug === slug);
  if (!sources.length) return null;
  return (
    <div className={compact ? "service-sources-compact" : "service-sources"}>
      <p className="text-[10px] uppercase tracking-[.18em] text-text-sage font-semibold mb-3">
        An independent place to start
      </p>
      {sources.map((source) => (
        <a
          key={source.href}
          href={source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <span className="flex justify-between gap-3 font-heading text-xl text-text-primary group-hover:text-text-sage">
            {source.name}
            <span aria-hidden="true">↗</span>
          </span>
          <span className="block text-sm text-text-muted mt-2">
            {source.description}
          </span>
          <span className="block text-xs text-text-sage mt-3">
            Visit their website{" "}
            <span className="text-text-muted">(new tab)</span>
          </span>
        </a>
      ))}
      {!compact && (
        <p className="mt-5 text-xs text-text-muted">
          Independent of Village. Confirm availability, suitability and costs
          directly.
        </p>
      )}
    </div>
  );
}
