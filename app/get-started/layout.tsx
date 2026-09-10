import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Build your starting village. Explore the support that fits your life, with no contact details needed to see your suggestions.",
};

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
