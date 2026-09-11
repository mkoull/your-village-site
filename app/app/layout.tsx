import type { ReactNode } from "react";
import { AppContext } from "@/components/app/AppContext";
import AppFrame from "@/components/app/AppFrame";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppContext>
      <AppFrame>{children}</AppFrame>
    </AppContext>
  );
}
