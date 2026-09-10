import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore meals, nannies, mental health, feeding support, household help, life admin and community for every stage of family life.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
