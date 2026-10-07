# Village website review — 8 October 2026

## Outcome

The public product remains a useful service-discovery and personal-shortlist website. It connects people to eight independent starting points, without inventing provider relationships, availability, bookings or payment processing. The circle mark, forest-and-lantern scene, typography and palette are preserved.

## Changes made

- **Return visits:** an optional Remember my village on this device checkbox keeps selected categories and progress after closing the tab. Session storage remains the default. The saved copy is allowlisted and excludes contact details, messages and legacy family-stage/timing context. Open tabs in the same browser receive updates. Turning remembering off removes the device copy, and Clear/Undo preserves the expected storage choice. Blocked storage produces an honest fallback.
- **Keeping and sharing:** the existing Keep my village for later link leads to one section for remembering, native sharing where supported, copying, downloading and printing. Sharing explicitly includes selected categories and progress. Cancelling the native share sheet is not presented as a failure or a delivered message.
- **Mobile priority:** save-for-later preferences sit with the export tools so the service actions remain the first useful content. My village copy is shorter. The optional setting remains accessible in the empty state when remembering is already enabled.
- **Form compatibility:** browser code now uses AbortController with cleanup timers instead of requiring AbortSignal.any/timeout. Older browsers can check availability and submit. A timed-out availability check ends in a working retry rather than an indefinite loading state.
- **Navigation and print:** a route-loading boundary makes slow navigation visible. Printing clears a pending removal notice and resets progress filters so all current saved choices can be included.
- **Maintenance:** patched sharp to 0.35.5 and source-map-js to 1.2.2 in the dependency lock; updated privacy, instructions and product documentation to match actual behaviour.

## Page review

| Pages | Role and outcome |
| --- | --- |
| Home | The light map saves in place and reveals a direct route to My village. Category links open their corresponding explanations. |
| Services | All eight categories have working details, save actions and independent service links. Search and filters survive a trip to a detail page. No-results recovery clears both controls. |
| Eight service pages | Each has one H1, a meaningful explanation, a real external next step, in-place saving, breadcrumb recovery and related support. |
| Build my village | Multiple choices lead directly to relevant service actions. Both list and map update the same village. |
| My village | Contains direct service links, visitor-recorded progress, filters, removable choices with Undo, saving preferences and export tools. |
| How it works | Explains the actual choose → explore/contact → keep-track journey, including optional device persistence. |
| Costs | Clearly distinguishes free use of Village from prices and terms set by independent services. |
| About | Retains the family-support concept across stages; does not turn Village into a postpartum coordinator. |
| Contact and updates | Availability is checked before forms open. Missing delivery configuration stays visible with useful alternate links. |
| Privacy | Describes default tab storage, explicit device storage, sharing and enquiry handling accurately. |
| Safety | Keeps verification and clinical boundaries explicit without claiming completed provider checks. |

## Verification

- 36 automated tests passed, including new data-minimisation, malformed-device-copy and older-browser transport cases. TypeScript and the production build passed.
- npm audit reported zero vulnerabilities after the two compatible patches.
- All 19 public content routes and 20 internal targets returned 200. All 19 rendered pages had one H1 and no horizontal overflow at 1280 and 320 pixels. Main journeys were also inspected at 393 pixels.
- Exercised five selections, cross-page navigation, catalogue search/details/back/reset, progress updates, filtered empty state, removal/Undo and Clear/Undo.
- Closed and reopened a tab: remembered choices and progress returned. Turned remembering off: a fresh tab started empty. Clear removed the device copy; Undo restored it with its earlier saving preference.
- A local fixture blocked both browser storage APIs: selections still worked through client navigation, attempted device saving showed an error, and Clear remained usable.
- All four form locations exercised with local mock rejection and acceptance, using synthetic data. Failed submissions retained values, successful contact submission focused its confirmation, and availability timeout/retry recovered. No production test leads were sent.
- A local fixture removed AbortSignal.any and AbortSignal.timeout: form availability and successful submission still worked.
- Checked mobile menu opening and Escape, removal focus, and manual progress controls. Copy and download actions ran; the in-app browser's download-event inspection timed out, so receipt of the downloaded file was not confirmed by that API.
- Existing independent sources were re-opened on their official websites. No pricing or availability promises added.

## Limits and remaining setup

These checks use desktop Chromium with phone-sized viewports. They are not a physical iPhone/Safari test, a complete screen-reader audit, or a guarantee of perfection. Native sharing and print/save-PDF still need device-level checks; no message was sent through a share sheet during testing.

The public enquiry endpoint remains unavailable until a real receiving service is configured. The connected Vercel tool can discover the project but returns 403 for private environment settings; the local Vercel CLI has no credentials. The existing server-side Resend/webhook adapter is ready, but a sender/domain, service credentials and authenticated environment access are still required. The owner's private inbox is not in public source. Actual inbox receipt must be confirmed before announcing that enquiries are open.

The account-based app remains on its separate integration branch. This website release does not publish fictional providers or the local SQLite prototype as a production booking app.

## Sources checked

- [The Dinner Ladies delivery information](https://www.dinnerladies.com.au/pages/delivery-info)
- [Nanager](https://nanager.com.au/)
- [Australian Breastfeeding Association](https://www.breastfeeding.asn.au/get-help)
- [PANDA](https://www.panda.org.au/about/about-panda)
- [Playgroup Victoria](https://www.playgroup.org.au/find/)
- [Tweddle](https://www.tweddle.org.au/)
- [Maid to Clean](https://www.maidtoclean.com.au/)
- [The Carellective](https://www.carellective.com.au/home-care-organisation)
- [sharp advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) and [source-map-js advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)
