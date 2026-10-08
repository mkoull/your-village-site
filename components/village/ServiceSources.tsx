import { existingSupport } from "@/content/existing-support";
import ArrowUpRight from "@/components/ui/ArrowUpRight";

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
        An independent service to explore
      </p>
      {sources.map((source) => (
        <div key={source.href} className="village-source-card">
          <p className="font-heading text-2xl text-text-primary">
            {source.name}
          </p>
          <p className="text-sm text-text-muted mt-2">{source.description}</p>
          {!compact && (
            <div className="service-first-step">
              <p>Your first step</p>
              <p>{source.nextStep}</p>
            </div>
          )}
          <a
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="village-source-action"
          >
            {source.action} <ArrowUpRight />
            <span className="sr-only">
              {" "}
              with {source.name} (opens a new tab)
            </span>
          </a>
          <p className="text-[11px] text-text-muted mt-2">
            Opens their website in a new tab
          </p>
          {compact && (
            <details className="village-next-step">
              <summary>How to take the next step</summary>
              <p>{source.nextStep}</p>
              <p>
                Confirm suitability, availability and costs directly. Saving
                this category does not send them your details.
              </p>
            </details>
          )}
        </div>
      ))}
      {!compact && (
        <p className="mt-5 text-xs text-text-muted">
          Independent and not verified by Village. Confirm coverage,
          suitability, availability and costs directly. Saving here doesn’t send
          an enquiry.
        </p>
      )}
    </div>
  );
}
