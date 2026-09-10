"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVillage } from "./VillageProvider";
import { services } from "@/content/services";

export default function VillageDock() {
  const { draft, message } = useVillage();
  const pathname = usePathname();
  if (!draft.needs.length || pathname === "/get-started") return null;
  return (
    <aside
      data-village-dock
      className="village-dock"
      aria-label="Your saved village"
    >
      <div className="village-dock-icons" aria-hidden="true">
        {draft.needs.slice(0, 3).map((slug) => {
          const s = services.find((item) => item.slug === slug)!;
          return (
            <span
              key={slug}
              className={`village-tone-${s.tone}`}
              dangerouslySetInnerHTML={{ __html: s.icon }}
            />
          );
        })}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {draft.needs.length} {draft.needs.length === 1 ? "kind" : "kinds"} of
          support
        </p>
        <p className="village-dock-caption">
          {message || "Your village is taking shape."}
        </p>
      </div>
      <Link href="/get-started" className="village-dock-link">
        View my village <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
