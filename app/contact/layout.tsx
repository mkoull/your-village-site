import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the Your Village team about postpartum support for your family in inner Melbourne. We reply the same day, usually within a few hours.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
