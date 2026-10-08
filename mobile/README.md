# Your Village mobile

First native family app, built with Expo SDK 57, React Native and Expo Router. Version 0.1.0 is an implementation and local preview, **not a signed phone build or an App Store release**.

## What works

- **My village:** a clear first action for a new visitor, an actionable next step for returning families, the original eight-circle identity, lights reflecting saved support, and editable private labels for help a family already has. The next reminder is prioritised; a step can be edited or completed directly from home.
- **Explore:** the shared catalogue and real independent starting points. Save in place; open details and return without losing search. Saving means saving a kind of support, not booking a provider.
- **My plan:** add a short next step from a service, edit it without losing its reminder or completion state, complete/reopen it, remove/undo it, and optionally request a local phone reminder. Entry limits explain how to make room; a finished plan has a distinct resting state.
- **Settings:** a preview of exactly what sharing includes, device/privacy explanations, public app privacy/help links, and confirmed removal of the village and its reminders. Share and reset failures remain visible inside their panels.
- Native entries use Expo SecureStore, with small Unicode-safe chunks, serialised writes and two complete generations. Failed saves are visible and retryable. Unreadable storage is not silently overwritten.
- Share text includes selected categories and progress only. Personal labels and task titles are excluded. Notifications use generic lock-screen text.

The installed app is a **guest, device-only** product. There are no accounts, cloud sync, bookings, payments, provider messages or clinical records. It does not connect to the website's fictional provider preview or its SQLite API. The public website remains a separate deployment. The browser preview uses memory only and resets on reload; it cannot prove secure native saving or notification delivery.

## Run and check

From this directory, using Node 24:

```sh
npm ci
npm run web
npm test
npm run typecheck
npm run lint
npx expo-doctor
npm run export
npm run preview:web
```

The final command serves the exported browser preview at `http://127.0.0.1:8084`, on this computer only. It does not expose a server to the internet. For Metro development, `npm start` opens Expo's development workflow. Use a development build for testing native capabilities; the web preview and Expo Go are not substitutes for testing the release binary.

Keep this project inside the repository: it imports only pure catalogue/model modules from `../content` and `../lib/village.ts`. Metro watches the parent repository. The root Next.js TypeScript configuration excludes `mobile/`; install and validate each app separately.

## Installable beta and stores

The owner must own the publisher accounts and app identifiers. On 8 October 2026, `eas whoami` reported **Not logged in**; no credentials or account identities were guessed and no build service purchase was made.

1. Sign in with `npx eas-cli@latest login`, then link an owner-controlled Expo project using the EAS project setup flow.
2. Set `VILLAGE_EAS_PROJECT_ID`, `VILLAGE_IOS_BUNDLE_ID` and `VILLAGE_ANDROID_PACKAGE` to the real project UUID and registered identifiers. `app.config.ts` reads them. Supply these non-secret values consistently for EAS config evaluation and the chosen EAS build environment. Do not commit credentials, certificates or tokens. Do not change package identifiers after distribution without treating that as a new app.
3. For **iPhone/TestFlight**, use `npm run build:ios` (the production/store profile). Apple membership, signing and App Store Connect setup are required. Upload the resulting build with the EAS submission flow, complete the beta metadata and invite testers. A production-profile build does not itself publish anything.
4. For a directly installable **Android beta APK**, use `npm run build:android` (internal preview). For Google Play's AAB, use `npm run build:android:store` instead. Keep the signing identity consistent.
5. The optional `development` profile produces a development client; iOS internal/ad-hoc builds require device registration. Do not confuse this route with TestFlight.

See [EAS Build](https://docs.expo.dev/build/introduction/), [EAS environment variables](https://docs.expo.dev/eas/environment-variables/) and [submission](https://docs.expo.dev/deploy/submit-to-app-stores/). Account enrollment, terms, fees and final store publication remain owner-controlled.

## Release checks still required

- Physical iPhone and Android: fresh install, offline catalogue, secure save/force-close/reopen, lock/unlock, interrupted save and recovery, reminder permission deny/grant, delivery while foreground/background/closed, tap routing, replace/cancel/complete/clear, native share cancellation, keyboard and back gestures.
- VoiceOver/TalkBack, larger system text and safe areas. The browser flows have been checked at phone sizes, but this does not validate native screen readers or OS layouts.
- Store-specific privacy disclosures, a public app privacy/support page and working support delivery. The website receiving service has not been verified as connected; do not claim otherwise. No user account exists in this version, so removal is device-data clearing.
- Current service coverage and descriptions, publisher metadata, screenshots from actual builds, age/content ratings, and any required Google closed-testing period. App review approval is an external decision.
- Review the outstanding dependency advisories below before a release decision.

On iOS, Keychain entries may survive uninstalling. **Clear my village** removes both generations. Android SecureStore backup exclusion is configured; device-only iOS accessibility prevents migrating entries to another device. There is no backup/recovery or cross-device promise. Practical short labels belong here; don't encourage clinical histories or sensitive notes.

## Dependency audit

Audit on 8 October 2026: **18 high findings propagated from two upstream toolchain packages**, with no moderate or critical findings. The reported roots are [`braces` <=3.0.3](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and [`node-forge` <=1.4.0](https://github.com/advisories/GHSA-86w9-cpqp-85rv). They arrive through Metro/development/build tooling. No compatible upstream patch was available in the resolved SDK toolchain during this build. Do not expose Metro publicly, feed untrusted build inputs into the toolchain, or represent this as a clean security audit. Recheck before distributing a signed release.

The lockfile overrides patched `query-string` and `xcode`'s `uuid` dependency. Expo Router expects query-string's older namespace export shape, so `src/platform/query-string.ts` and Metro's resolver preserve that API while using the patched parser. A regression test covers it and the detail-to-plan query navigation was browser tested. Remove the adapter only after testing an upstream compatible Router release. No `npm audit fix --force` SDK downgrade was applied.

## Implementation map

Validation on 8 October 2026: 18 mobile tests, TypeScript and lint passed; iOS, Android and web bundles exported successfully after the dashboard/editor update. New tests cover reminder-preserving edits, editing at capacity, invalid/deleted-entry handling and stable next-step ordering. Earlier baseline validation passed Expo Doctor's 21 checks and the website's 57 tests and production build. Baseline browser checks covered all eight detail/return routes at 320 px, the save/search/plan/progress/Undo/share/reset flows at phone sizes, and a 768 px layout. Dashboard/editor browser verification is recorded with the current release review. These results do not constitute native device testing or a signed binary.

- `src/app/`: native screens and navigation; service details are a modal route and next-step entry is a separate route.
- `src/domain/`: shared catalogue facade, bounded state/restore/share rules and testable persistence.
- `src/platform/`: SecureStore adapter, local reminders and Router parser compatibility.
- `src/state/`: hydration, optimistic updates, recovery, Undo and reminder lifecycle.
- `src/ui/`: original mark, line icons, warm scene, actionable dashboard card, shared add/edit step form, controls and layout.
- `tests/`: domain, privacy, interrupted-write and parser regressions.
- `app.config.ts`, `eas.json`: native configuration and build profiles; generated `ios/` and `android/` directories are not committed.
