import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Share your interest in Village, ask a question, or tell us about a service you offer.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
