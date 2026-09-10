# Your Village

Village brings the support mothers, families and individuals may need into one place: meals, nannies and family care, mental health and wellbeing, household help, specialist support and community. It is relevant at every stage of family life, including people who already have support and want a little more.

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

Next.js 15, React 19, Tailwind CSS 4 and TypeScript. All content pages are prerendered. One server endpoint, `POST /api/leads`, handles enquiries. The existing sage palette and Newsreader / Plus Jakarta Sans fonts are retained.

## Project structure

- `content/services.ts`: authoritative service catalogue; navigation, cards and questionnaire derive from it.
- `lib/assessment.ts`: stage options and shortlist selection. Keeps all selected services in their chosen order.
- `lib/use-lead-form.ts`: shared sending, success and error state with duplicate-submit protection.
- `lib/leads.ts`: same-origin browser transport; requires a positive delivery acknowledgement.
- `lib/lead-handler.ts`: bounded request validation and server-side webhook forwarding.
- `app/api/leads/route.ts`: environment configuration for the endpoint.
- `components/layout/InfoPage.tsx`: shared layout for informational pages.
- `tests/core.test.mjs`: transport, validation, error handling and shortlist regression checks.
- `docs/VILLAGE-NEXT.md`: product direction and next implementation milestones.

The legacy `/services/postpartum-carers` route now covers nannies and family care; its URL remains valid for existing links.

## Enquiry delivery

Set **LEAD_WEBHOOK_URL** in the intended Vercel environment to your existing HTTPS Zapier / Make / form-processing endpoint, then redeploy. Use a private server variable, not a NEXT_PUBLIC variable.

For migration, the server temporarily accepts the existing NEXT_PUBLIC_LEAD_WEBHOOK_URL setting. It is no longer referenced from client code. Remove the old variable after migration; if it was publicly distributed, rotate the webhook URL in the provider before relying on its secrecy.

The endpoint validates and limits the request body, accepts only assessment/contact/waitlist types, rejects cross-origin browser posts, and forwards only permitted fields. It refuses webhook redirects, uses an eight-second timeout and never logs personal data. Successful HTTP acknowledgement from the configured processor is required before the UI shows success.

- Missing configuration: 503, clear unavailable message, form data retained.
- Processor rejection or timeout: 502, retryable message, form data retained.
- Valid processor acknowledgement: 200, confirmation screen.
- No client-side fire-and-forget, no opaque no-cors delivery assumption.

The webhook must accept JSON and return a successful HTTP status. An HTTP acknowledgement is not proof that a later automation or email completed: verify the received record and downstream actions before accepting real enquiries. Ambiguous network failures can cause a duplicate if retried; durable deduplication belongs in the receiving workflow.

No form-provider account or credentials were created by this change. Configure rate limiting / abuse protection at the deployment or receiving workflow before promoting public intake. There is no durable rate limiter or database in this repository.

## Privacy

Unfinished questionnaire answers stay in component memory. Only an explicit final submission sends them. Analytics receive event names and step numbers, not personal answers. No anonymous localStorage identifier is created.

The privacy page describes current behaviour. Provider identities, processing locations, retention, privacy contact details and legal review still need to be completed before a wider launch. Do not invite sensitive clinical histories through these general enquiry forms.

## Deployment

The live site currently uses https://your-village-site.vercel.app. Update `lib/site.ts` when the custom domain is connected. Main deploys automatically in the existing Vercel setup; review changes on a branch/preview before merging.

The PostCSS override selects a patched 8.x release while retaining Next 15. Revisit it when Next's own bundled dependency is patched. The dependency audit was clean on 10 September 2026.
