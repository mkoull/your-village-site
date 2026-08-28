import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Four quick questions and we'll sketch your starting village — the postpartum support we'd put in place first for your family. Free first conversation, inner Melbourne.",
};

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
