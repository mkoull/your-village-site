import type { Metadata } from "next";
import VillageApp from "@/components/app/VillageApp";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your everyday village", robots: { index: false, follow: false }, manifest: "/village.webmanifest", referrer: "same-origin" };
export default async function Page({ params }: { params: Promise<{ screen?: string[] }> }) {
  const screen = (await params).screen || [];
  const valid = !screen.length || (screen.length === 1 && ["explore", "saved", "requests", "sign-in", "partner", "join", "owner", "privacy"].includes(screen[0])) || (screen.length === 2 && ["providers", "requests"].includes(screen[0]));
  if (!valid) notFound();
  return <VillageApp screen={screen}/>;
}
