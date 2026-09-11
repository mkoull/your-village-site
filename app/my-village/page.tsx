import type { Metadata } from "next";
import { Suspense } from "react";
import VillageBuilder from "@/components/village/VillageBuilder";

export const metadata: Metadata = {
  title: "My village",
  description:
    "The support you’ve chosen, brought together in your own village.",
  robots: { index: false, follow: true },
};

export default function MyVillagePage() {
  return (
    <Suspense
      fallback={
        <p role="status" className="pt-32 pb-20 text-center">
          Opening your village…
        </p>
      }
    >
      <VillageBuilder savedView />
    </Suspense>
  );
}
