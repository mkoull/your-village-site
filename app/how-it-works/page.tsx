import type { Metadata } from "next";
import InfoPage from "@/components/layout/InfoPage";
export const metadata: Metadata = {
  title: "How Village works",
  description:
    "Start with one thing that would make life easier. Your village can grow from there.",
};
const content = {
  eyebrow: "How Village works",
  headline: "From a little help to your own village.",
  intro:
    "Choose what would help, explore real services, and keep track as you bring support into your life.",
  sections: [
    [
      "01 · Choose your support",
      "Open Build my village and choose one or more kinds of help. Each choice lights up your village. If you prefer to read first, explore the service pages and use Add to my village as you go. Both routes save to the same place.",
    ],
    [
      "02 · Explore services and make contact",
      "My village brings together service links for your choices. Open a service’s website in a new tab to check what it offers, availability and costs, and make contact directly. Saving a category does not send an enquiry or create a booking.",
    ],
    [
      "03 · Keep track at your pace",
      "Use My progress to record whether you’re still exploring, have made contact, or have support in place. These are your own updates. Your choices and progress stay in this browser tab after a refresh. Copy, download or print a version to keep after closing the tab.",
    ],
    [
      "What's coming next",
      "We’re building towards a fuller local directory. For now, Village connects you to independent services and helps you organise your next steps. Booking and payment take place with the service you choose, where offered, rather than on this website.",
    ],
  ],
};
export default function Page() {
  return (
    <InfoPage
      {...content}
      sections={content.sections as [string, string][]}
      sectionLinks={[
        { label: "Choose my support", href: "/get-started" },
        { label: "Explore services", href: "/services" },
        { label: "Open my village", href: "/my-village" },
        { label: "The idea behind Village", href: "/about" },
      ]}
    />
  );
}
