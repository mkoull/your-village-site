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
      "Use Add to my village on any service to keep it in your shortlist. Open My village to add or remove support, include optional preferences, and see everything together. Your choices stay in this browser tab, including after a refresh.",
    ],
    [
      "03 · Take your next step",
      "Follow the links to independent services to check availability and costs. Copy or print your village to keep it. You can also choose to send an enquiry as the Village network develops; contact details are optional for browsing.",
    ],
    [
      "What's coming next",
      "We're working towards a fuller local directory with clear service details, credentials, prices and availability. Enquiries on this site help shape that network; you cannot book or pay for a service here yet.",
    ],
  ],
};
export default function Page() {
  return (
    <InfoPage {...content} sections={content.sections as [string, string][]} />
  );
}
