import type { Metadata } from "next";
import InfoPage from "@/components/layout/InfoPage";
export const metadata: Metadata = {
  title: "Privacy",
  description:
    "You can explore Village without sharing your contact details. Here is how the current website handles an enquiry.",
};
const content = {
  eyebrow: "Privacy",
  headline: "Your information, with care.",
  intro:
    "You can explore Village without sharing your contact details. Here is how the current website handles an enquiry.",
  sections: [
    [
      "Your village in this browser",
      "By default, selected support categories and progress stay in this browser tab using session storage. If you choose Remember my village on this device, those categories and progress are also saved in this browser’s local storage until you turn the option off, clear your village or clear site data. They are available to anyone using the same browser and do not sync to another device. Optional family stage and timing from older drafts stay in the tab only. Choices are not sent to Village as you update them. Contact details and messages are never saved in the draft. If storage is blocked, a refresh may clear your choices. Basic analytics record page views and event names, not selections, progress or contact details.",
    ],
    [
      "What you choose to send",
      "If you submit an enquiry, we receive the contact details, answers and optional message you include. A waitlist submission includes your email and your suburb if you provide it. Please do not include sensitive medical information in these forms.",
    ],
    [
      "Why we use it",
      "We use enquiries to understand interest in Village and follow up about the support or services you describe. Waitlist details are used for updates about Village.",
    ],
    [
      "Where submissions go",
      "Enquiries pass through our website to the form-processing service configured for Village. The Village team and the technology providers processing the enquiry handle that information. The page confirms receipt only after that service accepts the submission.",
    ],
    [
      "Your choices",
      "Contact us if you would like to ask about, correct or remove information you have submitted. You can explore, copy or print your village without sending an enquiry. Sharing a village includes selected categories and recorded progress in the text you choose to share. Copies or PDFs you create are yours to store or delete.",
    ],
    [
      "As Village develops",
      "Before provider accounts and bookings are introduced, this page will need further details about the providers processing information, storage locations, retention and your available controls.",
    ],
  ],
};
export default function Page() {
  return (
    <InfoPage
      {...content}
      sections={content.sections as [string, string][]}
      sectionLinks={[
        { label: "Manage my village", href: "/my-village" },
        null,
        null,
        null,
        { label: "Contact Village", href: "/contact" },
      ]}
    />
  );
}
