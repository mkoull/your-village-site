"use client";

import Link from "next/link";
import { useScrolled } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Mobile-only floating CTA. A new parent browsing one-handed shouldn't
 * have to scroll back to the top to act — the next step travels with her.
 * Appears once the hero is behind her; desktop keeps the navbar CTA.
 */
export default function StickyMobileCta() {
  const visible = useScrolled(700);

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        "md:hidden fixed bottom-0 inset-x-0 z-40 px-5 pt-4 transition-all duration-500 ease-out",
        "pb-[calc(1rem+env(safe-area-inset-bottom))]",
        "bg-gradient-to-t from-background via-background/90 to-transparent",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none",
      )}
    >
      <Link
        href="/get-started"
        className="btn-glow flex items-center justify-center gap-2 w-full px-7 py-4 rounded-full bg-sage-deep text-white font-medium text-[15px] shadow-lg active:scale-[0.98] transition-transform"
      >
        Build my village
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
