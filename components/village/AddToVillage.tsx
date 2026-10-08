"use client";
import { useVillage } from "./VillageProvider";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

export default function AddToVillage({
  slug,
  compact = false,
  className = "",
}: {
  slug: string;
  compact?: boolean;
  className?: string;
}) {
  const { draft, ready, setNeed } = useVillage();
  const selected = draft.needs.includes(slug);
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;
  return (
    <button
      type="button"
      disabled={!ready}
      aria-disabled={selected || !ready}
      aria-pressed={selected}
      aria-label={`${service.title}: ${selected ? "saved to my village" : "add to my village"}`}
      onClick={() => {
        if (!selected) setNeed(slug, true);
      }}
      className={cn(
        "village-add",
        selected && "village-add-selected",
        compact && "village-add-compact",
        className,
      )}
    >
      <span aria-hidden="true">{selected ? "✓" : "+"}</span>
      {selected ? "Saved to my village" : "Add to my village"}
    </button>
  );
}
