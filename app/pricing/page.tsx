import type { Metadata } from "next";
import InfoPage from "@/components/layout/InfoPage";
export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Exploring Village and sharing your interests are free. Service prices will be published as the provider network develops.",
};
const content = {
  eyebrow: "Pricing",
  headline: "Clarity before commitment.",
  intro:
    "Exploring Village and sharing your interests are free. Service prices will be published as the provider network develops.",
  sections: [
    [
      "A village is a mix, not one package",
      "Different people need different kinds of help. The cost of a meal service, a nanny or a professional appointment will depend on that provider's offer.",
    ],
    [
      "Rates are still being developed",
      "There are no confirmed service rates or platform fees to quote yet. Before bookings open, we need to show the price, what's included and any additional fees clearly.",
    ],
    [
      "No payments on this site",
      "An enquiry does not make a booking or commit you to a purchase. Payment, cancellation and provider terms will need to be available before anyone can book.",
    ],
    [
      "Tell us what would work for you",
      "If you have a budget or practical requirements in mind, you can mention them in your enquiry. That helps us understand what useful support would look like.",
    ],
  ],
};
export default function Page() {
  return (
    <InfoPage {...content} sections={content.sections as [string, string][]} />
  );
}
