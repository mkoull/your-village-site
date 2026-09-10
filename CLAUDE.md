# CLAUDE.md — Your Village

## Product direction confirmed by the owner

Village connects families with existing services, specialists and community support. Keep the experience practical and welcoming across family stages. The owner wants an immersive, usable village that grows as people add support, rather than literal explanations of every audience segment.

The current website is in development: browse service categories, follow links to independent services, and build a shortlist that stays across pages and refreshes. Enquiries require a configured receiving service. There are no real provider profiles, bookings or payments yet. See docs/VILLAGE-NEXT.md.

## Conventions

- Warm, calm, inclusive Australian English. Preserve existing palette and fonts.
- Never invent testimonials, provider counts, verification claims, prices, response times or availability.
- Derive service content from content/services.ts. Preserve established routes.
- Add to my village must save in place, with immediate selection state and a visible count; it must never restart a questionnaire or discard previous choices.
- Use VillageProvider and lib/village.ts for shared selection and session persistence. Do not persist contact fields or messages. Preserve clear/undo and local exports. Never send draft choices as analytics or step beacons.
- All forms use useLeadForm / submitLead and the same-origin /api/leads endpoint. Success requires processor acknowledgement. Do not log payloads.
- Keep content pages statically renderable. The one server endpoint is an intentional exception: it protects webhook configuration and confirms delivery.
- Use existing design tokens, Button and Container. Add dependencies only for a clear need.
- Accessible labels, selection states, keyboard navigation, focus handling and reduced motion are required.
- Keep deployment, business and privacy limitations accurate in copy and README.

## Verification

Run npm test, npm run typecheck and npm run build. Audit dependencies when updating them. Browser-check mobile navigation, service filtering/details, the complete builder (including more than three services, cross-page adds, refresh, legacy query links, last-item removal and clear/undo), validation, and success/failure of each form using synthetic data and a local/mocked receiving service. Do not send test leads to production.
