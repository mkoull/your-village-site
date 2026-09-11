import type { Metadata } from "next";
import VillageApp from "@/components/app/VillageApp";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ screen?: string[] }>;
}): Promise<Metadata> {
  const screen = (await params).screen || [];
  const titles: Record<string, string> = {
    explore: "Find support",
    saved: "My village",
    requests: screen.length === 2 ? "Your conversation" : "Requests",
    providers: "Meet your support",
    "sign-in": "Welcome to Village",
    partner: "Provider workspace",
    join: "Join as a provider",
    owner: "Owner workspace",
    privacy: "Your account privacy",
  };
  return {
    title: titles[screen[0]] || "Your everyday village",
    robots: { index: false, follow: false },
    manifest: "/village.webmanifest",
    referrer: "same-origin",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ screen?: string[] }>;
}) {
  const screen = (await params).screen || [];
  const valid =
    !screen.length ||
    (screen.length === 1 &&
      [
        "explore",
        "saved",
        "requests",
        "sign-in",
        "partner",
        "join",
        "owner",
        "privacy",
      ].includes(screen[0])) ||
    (screen.length === 2 && ["providers", "requests"].includes(screen[0]));
  if (!valid) notFound();
  return <VillageApp screen={screen} />;
}
