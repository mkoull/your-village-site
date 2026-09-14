# Your Village

Village helps families find and connect with the good services, specialists and community support already out there. Start with one need, from a nourishing meal to an extra pair of hands, and build a village around it.

The current website is a service-discovery and enquiry foundation. It does not yet contain provider accounts, live availability, bookings or payments.

## Development

Use Node 22.18+ (tested with Node 24).

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

Next.js 15, React 19, Tailwind CSS 4 and TypeScript. All content pages are prerendered. The server endpoint `/api/leads` checks configuration with GET and handles enquiries with POST. The existing sage palette and Newsreader / Plus Jakarta Sans fonts are retained.

## Project structure

- `content/services.ts`: authoritative service catalogue; the village map, interactive service guide, navigation and saved village derive from it.
- `content/existing-support.ts`: eight independent services linked from discovery pages and the personal plan, with official source URLs. These are public starting points, not claimed partners or vetted provider profiles. Recheck the source pages before changing service descriptions.
- `components/ui/VillageMark.tsx`: shared brand mark for navigation and homepage.
- `app/village.css`: shared support tones and original service-guide styles.
- `app/village-experience.css`: builder, saved-village controls, catalogue and information-page styles, including mobile and print layouts.
- `app/village-lights.css`: shared forest-and-lantern scene, immediate selected-state lighting, short click animations and warm page treatments. Motion settles after each interaction and respects reduced-motion preferences.
- `components/village/`: shared draft context, add/remove buttons, navigation count, live map, builder, exports and optional enquiry.
- The homepage and builder use the same `VillageScene`. Clicking either map adds/removes the real saved choice. The homepage reveals a relevant service link after selection. On the saved page, lit circles focus a support card; unlit circles add support and focus its card.
- `/get-started` is one choice screen that leads directly to `/my-village`, with no intervening questionnaire. Legacy need/stage URLs and existing drafts remain supported.
- `components/village/SavedVillage.tsx` shows direct service actions, manual progress, filters, removal/undo and the saved map. Progress never implies a provider acknowledgement or booking. `VillageExports.tsx` creates local copies including all choices and their progress, with a manual copy fallback.
- `app/journey.css`: shared service actions, category links, saved progress, mobile layouts and print rules. Homepage category links open their service pages directly.
- `components/ui/VillageBrand.tsx` combines the circle mark with the wordmark for header/footer; `app/brand.css` styles the lockup. Preserve eight small circles around a larger centre and keep `public/favicon.svg` consistent with `VillageMark`.
- `lib/village.ts`: versioned draft parser and immutable selection updates. Only allowlisted choices are restored from session storage.
- `lib/assessment.ts`: stage options and shortlist selection. Keeps all selected services in their chosen order.
- `lib/use-lead-form.ts`: shared sending, success and error state with duplicate-submit protection.
- `lib/leads.ts`: same-origin browser transport; requires a positive delivery acknowledgement.
- `lib/lead-handler.ts`: bounded request validation and server-side webhook forwarding.
- `app/api/leads/route.ts`: environment configuration for the endpoint.
- `components/layout/InfoPage.tsx`: shared layout for informational pages.
- `tests/core.test.mjs`: transport, validation, error handling and shortlist regression checks.
- `tests/village.test.mjs`: cross-page selection, restored drafts, invalid storage, removal and data-minimisation regressions.
- `tests/analytics-url.test.mjs`: support and context query parameters are removed from analytics URLs.
- `docs/VILLAGE-NEXT.md`: product direction and next implementation milestones.

The legacy `/services/postpartum-carers` route now covers nannies and family care; its URL remains valid for existing links.

## Enquiry delivery

Direct email delivery is also supported through Resend. Set `RESEND_API_KEY`, `LEAD_TO_EMAIL` (the owner's private receiving inbox), and `LEAD_FROM_EMAIL` (a verified sender) in Vercel's **Production** environment, then redeploy. Do not put these settings in public client variables or commit their values. The destination is fixed on the server, never accepted from a visitor's request. Replies to the notification go to the visitor's email.

Create the email-service account and verify the sender before enabling public intake. Resend's `onboarding@resend.dev` sender is for testing and only sends to the account owner's email; use a verified domain for production. Receiving notifications in Gmail does not require moving that inbox to the new domain. No real email credentials or recipient are committed to this repository.

Resend configuration takes precedence over the webhook below. A failure never automatically forwards to another provider, to avoid duplicate messages. A successful Resend response must contain an accepted message ID; complete setup by checking the receiving inbox, not just the HTTP response. Email-service authentication and Vercel environment access are still required to activate delivery.

Set **LEAD_WEBHOOK_URL** in the intended Vercel environment to your existing HTTPS Zapier / Make / form-processing endpoint, then redeploy. Use a private server variable, not a NEXT_PUBLIC variable.

For migration, the server temporarily accepts the existing NEXT_PUBLIC_LEAD_WEBHOOK_URL setting. It is no longer referenced from client code. Remove the old variable after migration; if it was publicly distributed, rotate the webhook URL in the provider before relying on its secrecy.

The endpoint validates and limits the request body, accepts only assessment/contact/waitlist types, rejects cross-origin browser posts, and forwards only permitted fields. It refuses webhook redirects, uses an eight-second timeout and never logs personal data. Successful HTTP acknowledgement from the configured processor is required before the UI shows success.

- Missing configuration: GET reports only acceptingEnquiries: false. Contact and updates pages replace forms with a clear availability message and working service/saved-village links; homepage and saved-page optional capture forms are hidden. POST also returns 503. No webhook value is exposed.
- Processor rejection or timeout: 502, retryable message, form data retained.
- Valid processor acknowledgement: 200, confirmation screen.
- No client-side fire-and-forget, no opaque no-cors delivery assumption.

The webhook must accept JSON and return a successful HTTP status. An HTTP acknowledgement is not proof that a later automation or email completed: verify the received record and downstream actions before accepting real enquiries. Ambiguous network failures can cause a duplicate if retried; durable deduplication belongs in the receiving workflow.

No form-provider account or credentials were created by this change. Configure rate limiting / abuse protection at the deployment or receiving workflow before promoting public intake. There is no durable rate limiter or database in this repository.

## Privacy

Selected service slugs and allowlisted progress are saved in sessionStorage for this browser tab. Optional family stage/timing and step from legacy drafts remain compatible. Choices and progress survive navigation and refresh, but not closing the tab. Drafts are versioned, bounded and allowlisted when restored. Removing a category removes its progress; removal and Clear village offer an in-page Undo. A blocked-storage fallback keeps the draft in React memory and explains the refresh limitation. Contact fields and notes are never persisted.

Only an explicit enquiry submits selections and contact details. Page analytics receive no draft fields. No anonymous localStorage identifier is created. Copy, download and print exports happen locally; the visitor controls their resulting copies.

The privacy page describes current behaviour. Provider identities, processing locations, retention, privacy contact details and legal review still need to be completed before a wider launch. Do not invite sensitive clinical histories through these general enquiry forms.

## Deployment

The live site currently uses https://your-village-site.vercel.app. Update `lib/site.ts` when the custom domain is connected. Main deploys automatically in the existing Vercel setup; review changes on a branch/preview before merging.

The PostCSS override selects a patched 8.x release while retaining Next 15. Revisit it when Next's own bundled dependency is patched. The dependency audit was clean on 10 September 2026.
