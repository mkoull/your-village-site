# Website journey review — 14 September 2026

The public website helps visitors choose support categories, explore independent services, keep track of their own progress, and export their shortlist. It does not book services or contact providers on the visitor's behalf.

## Fixes

- Search and category filters survive a trip to a service page and back. Searches stay in React memory, out of storage and analytics. A visible reset clears both filters and search.
- Saved buttons say **Saved · Remove**, so their action is explicit. Removing a saved card leaves an inline message and Undo at that position. Undo restores the card and focus. Clearing the whole village remains reversible.
- Progress changes under a filter return focus to a visible heading. Buttons, fields and links have scroll clearance from the fixed header and bottom controls.
- My village explains session-only saving beside the saved count and links directly to copy/download/print tools.
- The mobile map keeps one short tap instruction. The existing circle design, glow, hover, press and reduced-motion behaviour remain intact.
- Homepage browse links consistently lead to the catalogue. Service links are labelled as independent. The builder's next action says **See my support options**, matching the curated links it opens.
- Informational-page index numbers have sufficient contrast. Mobile inputs and progress controls use 16px text to avoid the usual iOS focus zoom.
- Forms wait for an availability check, offer a retry after connection failure, preserve entered values after a failed submission, and move focus to confirmed success. They never claim a submission succeeded without a positive receiver acknowledgement.
- Direct email notifications can use private Resend credentials, a fixed receiving inbox and a verified sender. Visitors cannot supply an alternate recipient. The existing webhook option remains supported.

## Verification

- Reviewed all 19 public content routes, including all eight support categories, plus the missing-page recovery screen. Internal navigation targets returned 200; the intentional missing route returned 404. One H1 per rendered content page.
- Checked layouts at 320, 393, 768 and 1440px widths; no horizontal overflow in the reviewed pages. Checked light-map target overlap, mobile menu, desktop dropdown, Escape, keyboard focus and reduced motion.
- Exercised choosing more than three categories, in-place saving, cross-page state, legacy query import, refresh, last-item removal, clear/Undo, progress filters, provider links opening in a separate tab, returning with selections intact, copying and downloading.
- Simulated blocked browser storage: choices remain usable during navigation and the page explains the limitation.
- Contact, updates, homepage signup and optional village enquiry each exercised with local mock success and failure responses. Also checked native required-field validation and availability-check failure/retry. No real or production enquiries submitted.
- Production-build axe checks: no automatically detected violations across the 19 pages. Gradient/pseudo-element contrast still requires human judgement; this is not a screen-reader or full WCAG certification. Desktop Chromium with phone-sized viewports was used, not a physical iPhone/Safari run.
- 33 automated tests, TypeScript check and production build passed. Production dependency audit reported zero vulnerabilities.

## Remaining setup

Live enquiries remain closed until an email-service account, verified sender and private Vercel production settings are configured. The owner's requested inbox is kept only in ignored local configuration, not in public source or browser assets. See the README's enquiry delivery instructions. Verify an actual received notification before promoting intake, and configure abuse protection at the receiving service or deployment.

A custom website domain can be added independently. The app prototype is maintained on its separate integration branch; this release contains only the public website.
