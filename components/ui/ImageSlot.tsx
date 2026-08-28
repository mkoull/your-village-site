import { cn } from "@/lib/utils";

/**
 * Placeholder for real photography.
 * TODO(mario): supply photographs for every ImageSlot — no AI-glossy
 * stock families. Until then this renders an honest, on-brand
 * placeholder (sage wash + constellation mark), never a fake photo.
 */
export default function ImageSlot({
  label,
  ratio = "4/3",
  className,
}: {
  label: string;
  ratio?: "4/3" | "3/4" | "1/1" | "16/9";
  className?: string;
}) {
  const ratioClass = {
    "4/3": "aspect-[4/3]",
    "3/4": "aspect-[3/4]",
    "1/1": "aspect-square",
    "16/9": "aspect-video",
  }[ratio];

  return (
    <div
      role="img"
      aria-label={`${label} (photograph to come)`}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle",
        "bg-gradient-to-br from-sage/15 via-surface to-warm/10",
        ratioClass,
        className
      )}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <svg viewBox="0 0 64 64" width="34" height="34" fill="none" aria-hidden="true" className="text-sage/50">
          <circle cx="32" cy="10" r="5.5" fill="currentColor" opacity="0.85" />
          <circle cx="51" cy="21" r="5.5" fill="currentColor" opacity="0.75" />
          <circle cx="51" cy="43" r="5.5" fill="currentColor" opacity="0.65" />
          <circle cx="32" cy="54" r="5.5" fill="currentColor" opacity="0.8" />
          <circle cx="13" cy="43" r="5.5" fill="currentColor" opacity="0.7" />
          <circle cx="13" cy="21" r="5.5" fill="currentColor" opacity="0.78" />
        </svg>
        <p className="text-xs text-text-muted tracking-wide">{label}</p>
      </div>
    </div>
  );
}
