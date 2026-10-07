# Village for iPhone and Android

Updated 8 October 2026. The owner requested the app and authorised building it. The first native family implementation now lives in [`mobile/`](../mobile/README.md). It is not yet a signed phone build, TestFlight release or store submission.

## The reason to install

Bring the support a family already has together with the help they still need, then return to one clear next step. The website introduces Village and helps people discover services. The app provides an ongoing personal support space.

## Implemented first version

| Area | Outcome |
| --- | --- |
| My village | Eight lights reflect chosen support. Tapping opens details; explicit controls add or remove. Existing support can be recorded as private short labels. |
| Explore | Browse eight categories and real independent starting points. Save in place and return from details without losing search. |
| My plan | Add, complete, reopen and undo removal of practical next steps. Optional reminders are scheduled locally on the phone. |
| Settings | Preview sharing, understand device-only privacy and explicitly clear saved entries and reminders. |

The original mark, warm palette and typography are retained. Permission for reminders is requested only when setting one. Sharing excludes personal labels and task titles. There is no address-book import, clinical history collection or fictional provider catalogue in the native app.

Guest, device-only usage is the current scope assumption while the owner considers bookings/payments. The web browser preview resets on reload; native saving uses SecureStore. There is **no cloud sync, account recovery, messaging, booking or payment processing** in this version.

## Architecture and future account work

React Native/Expo screens reuse the canonical TypeScript service catalogue and pure selection/progress rules. They do not package the existing Next.js DOM pages or server-only SQLite store. The website and its separate `/app` account/provider prototype remain separate from the native guest implementation.

A future account release needs an authenticated production API, durable managed storage, recovery, verification, account deletion and tested mobile authentication. Do not weaken the web API's same-origin or ownership checks to make it accessible from a phone. Choose identity/hosting and validate real operations before migrating to that release scope.

Provider messaging needs real participating providers and notification delivery. Booking/payment additionally needs agreed fulfilment, cancellation, refund and commercial arrangements. The prototype referral ledger is not payment processing.

## Remaining delivery sequence

1. Owner signs in to Expo and supplies owner-controlled Apple/Google publisher identities and app identifiers. EAS is currently not signed in on this computer.
2. Create signed beta builds and test on physical iPhone and Android devices, including storage, notifications, accessibility, offline usage and native navigation.
3. Resolve/review remaining upstream toolchain advisories, prepare app-specific public privacy/support pages and verify support delivery.
4. Prepare build screenshots and accurate store metadata/data disclosures. Test with families using TestFlight and Google Play testing.
5. Fix observed issues, then submit for external review. Uploading a build is not a public launch.

Detailed commands, implemented limits and release gates are in the [mobile runbook](../mobile/README.md).

## Store guidance

- Apple expects meaningful utility, working features and device testing. If account creation is added, in-app account deletion is required. See [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/).
- Expo supports cloud signing/builds from Windows. An iOS upload reaches App Store Connect/TestFlight; public review is separate. See [EAS Build](https://docs.expo.dev/build/introduction/) and [submission](https://docs.expo.dev/deploy/submit-to-app-stores/).
- New personal Google Play accounts created after 13 November 2023 currently require a closed test with 12 continuously opted-in testers for 14 days before applying for production access. Confirm the actual account type. See [Google testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en).
- If accounts are added, Google's applicable account-deletion requirements include an externally accessible request path. See [Google account deletion guidance](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en).

No publisher enrollment, signing credential, paid subscription, binary upload or public store submission has been completed during this build.
