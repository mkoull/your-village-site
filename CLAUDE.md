# CLAUDE.md — Your Village

## Product direction confirmed by the owner

Village connects families with existing services, specialists and community support. Keep the experience practical and welcoming across family stages. The owner wants an immersive, usable village that grows as people add support, rather than literal explanations of every audience segment.

The current website is in development: browse service categories, follow links to independent services, and build a shortlist that stays across pages and refreshes. Enquiries require a configured receiving service. There are no real provider profiles, bookings or payments yet. See docs/VILLAGE-NEXT.md.

## Conventions

- Warm, calm, inclusive Australian English. Preserve existing palette and fonts.
- The village scene uses forest green and warm lantern light. Selecting support lights its circle, path and matching card immediately. Keep movement brief and responsive to the interaction; honour reduced motion. Homepage and builder must share the scene and saved state.
- Never invent testimonials, provider counts, verification claims, prices, response times or availability.
- Derive service content from content/services.ts. Preserve established routes.
- Add to my village must save in place, with immediate selection state and a visible count; it must never restart a questionnaire or discard previous choices.
- My village links go to /my-village. /get-started is a single choice screen that leads directly to services in the saved village. Do not add questions unless their answers change a useful result. Edit my choices goes back to /get-started. Keep a useful empty state and undo after removal.
- The saved-page map opens an existing support card or adds a new category; it must not remove a saved item when someone tries to explore it. Progress (exploring, contacted, in-place) is explicitly recorded by the visitor, never inferred from opening a link or presented as a confirmed booking.
- Use VillageProvider and lib/village.ts for shared selection and allowlisted progress. Session storage is the default. Device storage requires the explicit Remember checkbox and includes only categories and progress, not legacy context, contact fields or messages. Keep same-browser tabs in sync while remembering; turning it off removes the device copy. Clear/undo must preserve these semantics. Never send choices or progress as analytics or step beacons.
- All forms use useLeadForm / submitLead and the same-origin /api/leads endpoint. Success requires processor acknowledgement. Do not log payloads.
- Keep content pages statically renderable. The one server endpoint is an intentional exception: it protects webhook configuration and confirms delivery.
- Use existing design tokens, Button and Container. Add dependencies only for a clear need.
- Accessible labels, selection states, keyboard navigation, focus handling and reduced motion are required.
- Keep deployment, business and privacy limitations accurate in copy and README.

## Verification

Run npm test, npm run typecheck and npm run build. Audit dependencies when updating them. Browser-check mobile navigation, service filtering/details, the complete builder (including more than three services, cross-page adds, refresh, legacy query links, last-item removal and clear/undo), validation, and success/failure of each form using synthetic data and a local/mocked receiving service. Do not send test leads to production.
