import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waitlist",
  description:
    "Hear about Village as its support network develops. Register your interest and tell us your suburb.",
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
