import type { Metadata } from "next";
import InfoPage from "@/components/layout/InfoPage";
export const metadata: Metadata = {
  title: "Costs & pricing",
  description:
    "Village is free to explore. Each independent service sets its own prices and terms.",
};
const content = {
  eyebrow: "Costs & pricing",
  headline: "What does support cost?",
  intro:
    "Using Village to explore, save support and keep track is free. The services you choose have their own prices and terms.",
  sections: [
    [
      "Choose what works for your budget",
      "A village can start with one service. Meals, care, household help and professional appointments have different costs. Follow the service links to see current information or request a quote directly.",
    ],
    [
      "Check the full cost with the service",
      "Before you commit, ask what is included, whether there is a minimum spend or booking length, and whether there are delivery, travel or cancellation fees. Each service can explain its own terms.",
    ],
    [
      "Saving support is free",
      "Add to my village creates a personal shortlist. It does not sign you up, send an enquiry, book a service or take payment. You can change or remove your choices whenever you like.",
    ],
    [
      "When you’re ready to arrange support",
      "Use the service’s own website to get in touch and agree on the details. Village does not currently handle bookings or payments. You can record your own progress in My village after making contact.",
    ],
  ],
};
export default function Page() {
  return (
    <InfoPage
      {...content}
      sections={content.sections as [string, string][]}
      sectionLinks={[
        { label: "Explore service options", href: "/services" },
        null,
        { label: "Choose support to save", href: "/get-started" },
        { label: "Open my village", href: "/my-village" },
      ]}
    />
  );
}
