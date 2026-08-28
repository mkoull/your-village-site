import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Meals, postpartum carers, overnight and sleep support, lactation, counselling, household help, life admin and community — vetted providers across inner Melbourne, coordinated by one team.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
