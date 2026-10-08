import type { Metadata } from "next";
import InfoPage from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "Help with the mobile app",
  description:
    "Help with your saved village, next steps, reminders, sharing and privacy in the first Village phone app.",
};

export default function AppSupportPage() {
  return (
    <InfoPage
      eyebrow="Mobile app help"
      headline="A little help, right here."
      intro="The first phone app is in development. These answers explain its current experience, including what is different in a browser preview."
      sections={[
        [
          "Getting the app",
          "Village is not yet available in the App Store or Google Play. For now, use the website to explore services and build a village in your browser. We will link to the official download pages here once the phone app is available. A browser preview is not an installed phone app.",
        ],
        [
          "Finding and saving support",
          "Explore lets you browse or search the kinds of help available. Add to my village saves your choice where you are. In My village, tap a circle or saved card to read more. Visit service website opens the independent service so you can check coverage, suitability, prices and availability directly. Saving never sends an enquiry or books anything.",
        ],
        [
          "Next steps and reminders",
          "Add a small next step from a service or My plan, then return to it at your own pace. Remind me asks your phone to schedule a nudge. If reminders are disabled, check Village’s notification permission and your phone’s Focus or Do Not Disturb settings. The browser preview cannot send phone reminders. Completing or removing a step cancels its reminder; Undo restores a removed step without a reminder, so choose a new time if needed.",
        ],
        [
          "Where your village is saved",
          "The installed phone app saves on that device. It does not sync with this website or another phone. The browser preview resets when you reload. If a save fails, keep the app open and use Retry; unsaved changes may disappear when you close it. If a saved copy cannot open, unlock the phone and try again before choosing Start fresh, which removes that copy.",
        ],
        [
          "Sharing and clearing",
          "Settings → Preview what I’ll share shows the exact text before you choose a recipient. Personal support labels and next-step titles are not included. Settings → Clear my village removes app entries and cancels reminders, with a confirmation first. This is permanent and cannot recall copies you already shared. On iPhone, use this control before uninstalling if you want secure saved entries removed.",
        ],
        [
          "A service, an app question, or urgent help",
          "For availability, bookings, cancellations or prices, contact the independent service directly. For a Village app question, the website contact page shows whether enquiries are currently open. If you report a problem, include your app version, phone model and what you were trying to do, without personal or health details. Village does not monitor emergencies or provide clinical care; use local emergency or crisis support when needed.",
        ],
      ]}
      sectionLinks={[
        { label: "Start on the website", href: "/get-started" },
        { label: "Explore services", href: "/services" },
        null,
        { label: "App privacy", href: "/mobile-app/privacy" },
        null,
        { label: "Contact options", href: "/contact" },
      ]}
    />
  );
}
