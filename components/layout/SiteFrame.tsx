"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import VillageDock from "@/components/village/VillageDock";
export default function SiteFrame({ children }: { children: ReactNode }) {
  const path = usePathname(); const app = path === "/app" || path.startsWith("/app/");
  return <>{!app && <Navbar/>}<main id="main-content" tabIndex={-1}>{children}</main>{!app && <><Footer/><VillageDock/></>}</>;
}
