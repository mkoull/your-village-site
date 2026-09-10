# CLAUDE.md — Your Village

## Product direction confirmed by the owner

Village brings all the services a person or family may need into one place: food, nannies, mental health, household help and more. Serve mothers, existing families and people at every stage, whether they already have a support network or need extra help. Do not narrow it to postpartum care or a single coordinator.

The current website is in development: browse service categories, build a shortlist and send an enquiry. There are no real provider profiles, bookings or payments yet. See docs/VILLAGE-NEXT.md.

## Conventions

- Warm, calm, inclusive Australian English. Preserve existing palette and fonts.
- Never invent testimonials, provider counts, verification claims, prices, response times or availability.
- Derive service content from content/services.ts. Preserve established routes.
- Show the shortlist before asking for contact details. Keep unfinished personal answers local; never send them as analytics or step beacons.
- All forms use useLeadForm / submitLead and the same-origin /api/leads endpoint. Success requires processor acknowledgement. Do not log payloads.
- Keep content pages statically renderable. The one server endpoint is an intentional exception: it protects webhook configuration and confirms delivery.
- Use existing design tokens, Button and Container. Add dependencies only for a clear need.
- Accessible labels, selection states, keyboard navigation, focus handling and reduced motion are required.
- Keep deployment, business and privacy limitations accurate in copy and README.

## Verification

Run npm test, npm run typecheck and npm run build. Audit dependencies when updating them. Browser-check mobile navigation, service filtering/details, all questionnaire steps (including more than three selected services), validation, and success/failure of each form using synthetic data and a local/mocked receiving service. Do not send test leads to production.
