import type { ReactNode } from "react";
import { AppContext } from "@/components/app/AppContext";
import AppFrame from "@/components/app/AppFrame";
import SupportBrowser from "@/components/app/SupportBrowser";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppContext>
      <SupportBrowser>
        <AppFrame>{children}</AppFrame>
      </SupportBrowser>
    </AppContext>
  );
}
