import type { Metadata } from "next";
import InfoPage from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "Mobile app privacy",
  description:
    "How the first Village phone app stores your village on your device, handles reminders and sharing, and lets you remove your information.",
};

export default function AppPrivacyPage() {
  return (
    <InfoPage
      eyebrow="Mobile app privacy · Updated 8 October 2026"
      headline="Your village. Your information."
      intro="This explains the first, device-only Village phone app being prepared for iPhone and Android. It is separate from the website and has no user account or cloud sync."
      sections={[
        [
          "What stays on your phone",
          "The app stores the support categories and progress you choose, short labels for support you already have, next-step titles, completion status and any reminder times and identifiers. These entries stay in the phone’s secure storage and are not uploaded to a Village server. Use practical labels; leave contact details and health information out of your plan. Anyone who can open the app on your unlocked phone can see its contents.",
        ],
        [
          "Reminders, when you choose them",
          "The app asks for notification permission when you set a reminder. Reminders are scheduled on your phone, not sent by a Village messaging service. Their lock-screen text is generic and does not include your task title or support category. You can remove a reminder in My plan or manage permission in your phone settings.",
        ],
        [
          "Sharing is your choice",
          "Before sharing, the app shows exactly what will be included: selected kinds of support and the progress you recorded. Existing-support labels and next-step titles are left out. You choose the receiving app or person in your phone’s sharing options. A copy you send is then handled by that recipient and service; clearing Village cannot recall it.",
        ],
        [
          "Websites you open",
          "The app includes links to independent service websites and to this website’s help pages. Those websites handle their own information, cookies and privacy settings. The phone app has no advertising or analytics tracking and does not request your contacts, camera, microphone or location. This website’s privacy notice covers visits and any forms you choose to submit here.",
        ],
        [
          "Remove your village",
          "Settings → Clear my village removes saved categories, progress, personal support labels and next steps from the app’s device storage, and cancels its scheduled reminders. This cannot be undone. iPhone secure storage may survive uninstalling, so use Clear my village before uninstalling if you want to remove it. Removing an individual item updates your plan; a previous encrypted recovery copy may remain until a later save or a full clear.",
        ],
        [
          "Changing phones and browser previews",
          "There is no cloud backup, transfer or account recovery in this version. Keep a separate copy of anything important. Website choices do not automatically appear in the app. The browser preview of the phone app holds entries only while the page is open and clears them on reload; it does not provide phone reminders or secure phone storage.",
        ],
        [
          "Questions and changes",
          "The app help page explains saving, reminders, sharing and clearing. Before wider release, this notice will be checked against the signed app and its store disclosures. If a future version adds accounts, syncing or other data processing, we will explain that change and the available choices. The website contact page shows whether enquiries are currently available.",
        ],
      ]}
      sectionLinks={[
        null,
        { label: "Help with reminders", href: "/mobile-app/support#section-3" },
        null,
        { label: "Website privacy", href: "/privacy" },
        null,
        null,
        { label: "Help with the app", href: "/mobile-app/support" },
      ]}
    />
  );
}
