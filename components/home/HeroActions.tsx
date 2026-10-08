"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useVillage } from "@/components/village/VillageProvider";

export default function HeroActions() {
  const { draft, ready } = useVillage();
  const saved = ready && draft.needs.length > 0;

  return (
    <div className="hero-reveal hero-reveal-4">
      <div className="hero-primary-actions">
        <Button href={saved ? "/my-village" : "/get-started"}>
          {saved ? "Open my village" : "Build my village"}
          <span aria-hidden="true">→</span>
        </Button>
        <Link href="/services" className="hero-browse-link">
          {saved ? "Find more support" : "Browse support first"}
        </Link>
      </div>
      <p className="hero-action-note">
        {saved
          ? `${draft.needs.length} ${draft.needs.length === 1 ? "kind" : "kinds"} of support saved. Pick up where you left off.`
          : "Free to explore. No account needed. Start with one thing."}
      </p>
    </div>
  );
}
