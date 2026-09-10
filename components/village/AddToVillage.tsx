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
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${service.title.toLowerCase()} ${selected ? "from" : "to"} my village`}
      onClick={() => setNeed(slug, !selected)}
      className={cn(
        "village-add",
        selected && "village-add-selected",
        compact && "village-add-compact",
        className,
      )}
    >
      <span aria-hidden="true">{selected ? "✓" : "+"}</span>
      {selected ? "In my village" : "Add to my village"}
    </button>
  );
}
