import type { Metadata } from "next";
import InfoPage from "@/components/layout/InfoPage";
export const metadata: Metadata = {
  title: "Trust & safety",
  description:
    "Village is in development. These are the principles guiding our provider network, rather than claims that checks have already been completed.",
};
const content = {
  eyebrow: "Trust & safety",
  headline: "Choosing support with confidence.",
  intro:
    "The services linked here are independent of Village. We have not verified their providers. Explore their information and confirm that the service suits your needs before arranging support.",
  sections: [
    [
      "Checks that fit the service",
      "A nanny, a meal provider and a mental health professional do different work. Our onboarding needs to reflect each role, including relevant identity, child-safety, qualification and insurance checks.",
    ],
    [
      "Clear credentials",
      "Provider profiles should explain credentials, relevant experience, scope of practice and what has been checked. We will not publish a verified badge without evidence behind it.",
    ],
    [
      "Your preferences matter",
      "Choosing support should include knowing who will come into your home, what they offer, their approach and how to raise a concern.",
    ],
    [
      "Professional support",
      "Clinical advice, assessment and treatment belong with appropriately qualified professionals. This website helps explore support categories; it does not provide clinical care.",
    ],
    [
      "Before bookings open",
      "Provider onboarding, complaints handling, cancellation terms and safeguarding processes need to be in place. These are part of building Village responsibly.",
    ],
  ],
};
export default function Page() {
  return (
    <InfoPage
      {...content}
      sections={content.sections as [string, string][]}
      sectionLinks={[
        null,
        null,
        { label: "Explore the service information", href: "/services" },
        null,
        { label: "How Village works today", href: "/how-it-works" },
      ]}
    />
  );
}
