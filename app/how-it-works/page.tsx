import type { Metadata } from "next";
import InfoPage from "@/components/layout/InfoPage";
export const metadata: Metadata = {
  title: "How Village works",
  description:
    "Start with one thing that would make life easier. Your village can grow from there.",
};
const content = {
  eyebrow: "How Village works",
  headline: "Find your kind of support.",
  intro:
    "Start with one thing that would make life easier. Your village can grow from there.",
  sections: [
    [
      "01 · Explore what could help",
      "Browse the service categories. Each explains the kind of support, who it may suit and questions to consider. You can also use Build my village if you would like a starting point.",
    ],
    [
      "02 · Choose what fits your life",
      "Answer four questions and see a shortlist based on the services you choose. Your answers stay on the page until you decide to send an enquiry. The shortlist is a starting point, not clinical advice or a confirmed booking.",
    ],
    [
      "03 · Share your interests, if you like",
      "Leave your details if you'd like us to follow up as Village develops. Existing support is welcome: you might need just one extra thing.",
    ],
    [
      "What's coming next",
      "We're working towards local provider listings with clear service details, credentials, prices and availability. Enquiries on this site help shape that network; you cannot book or pay for a service here yet.",
    ],
  ],
};
export default function Page() {
  return (
    <InfoPage {...content} sections={content.sections as [string, string][]} />
  );
}
