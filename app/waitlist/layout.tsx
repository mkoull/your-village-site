import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waitlist",
  description:
    "Outside inner Melbourne, or not ready yet? Join the Your Village waitlist and hear when we reach your suburb.",
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
