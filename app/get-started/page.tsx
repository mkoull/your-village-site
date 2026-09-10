import { Suspense } from "react";
import VillageBuilder from "@/components/village/VillageBuilder";
export default function GetStartedPage() {
  return (
    <Suspense
      fallback={
        <div role="status" className="pt-32 pb-20 text-center">
          Opening your village…
        </div>
      }
    >
      <VillageBuilder />
    </Suspense>
  );
}
