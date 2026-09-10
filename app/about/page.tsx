import type { Metadata } from "next";
import InfoPage from "@/components/layout/InfoPage";
export const metadata: Metadata = {
  title: "About Village",
  description:
    "A place to bring together the support you need, for the life you're living now.",
};
const content = {
  eyebrow: "About Village",
  headline: "Everyone deserves a village.",
  intro:
    "A place to bring together the support you need, for the life you're living now.",
  sections: [
    [
      "Where the idea began",
      "The arrival of our twins showed us how much the right help can matter. A meal, a break, a person who understands. Finding that support can be hard at exactly the moment you need it most.",
    ],
    [
      "Beyond the newborn weeks",
      "Support matters through every stage: young children, growing families, returning to work, changing circumstances, or taking care of yourself. You may already have a strong network and still need something more.",
    ],
    [
      "Many kinds of help, in one place",
      "Village brings practical help, family care, professional support and community into one place to explore. The aim is to make it easier to find the mix that works for you.",
    ],
    [
      "Building it with you",
      "We're developing the service network and learning what people need. Today you can build a village that stays with you as you browse, explore independent services and keep a copy of your plan. Booking and payment through Village are still to come.",
    ],
  ],
};
export default function Page() {
  return (
    <InfoPage {...content} sections={content.sections as [string, string][]} />
  );
}
