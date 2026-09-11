# CLAUDE.md — Your Village

## Product direction confirmed by the owner

Village connects families with existing services, specialists and community support. Keep the experience practical and welcoming across family stages. The owner wants an immersive, usable village that grows as people add support, rather than literal explanations of every audience segment.

The website supports category discovery and a browser-tab shortlist. The `/app` web app now supports server-side accounts, saved providers, request conversations, offers, completion confirmation and owner/provider workspaces. Its local preview contains explicitly fictional providers. No external email, real provider onboarding or payment processing is configured. See docs/VILLAGE-APP.md and docs/VILLAGE-NEXT.md.

## Conventions

- Warm, calm, inclusive Australian English. Preserve existing palette and fonts.
- The village scene uses forest green and warm lantern light. Selecting support lights its circle, path and matching card immediately. Keep movement brief and responsive to the interaction; honour reduced motion. Homepage and builder must share the scene and saved state.
- Never invent testimonials, provider counts, verification claims, prices, response times or availability.
- Derive service content from content/services.ts. Preserve established routes.
- Add to my village must save in place, with immediate selection state and a visible count; it must never restart a questionnaire or discard previous choices.
- My village links go to /my-village. /get-started is a single choice screen that leads directly to services in the saved village. Do not add questions unless their answers change a useful result. Edit my choices goes back to /get-started. Keep a useful empty state and undo after removal.
- The saved-page map opens an existing support card or adds a new category; it must not remove a saved item when someone tries to explore it. Progress (exploring, contacted, in-place) is explicitly recorded by the visitor, never inferred from opening a link or presented as a confirmed booking.
- Use VillageProvider and lib/village.ts for shared selection, allowlisted progress and session persistence. Do not persist contact fields or messages. Preserve clear/undo and local exports. Never send draft choices or progress as analytics or step beacons.
- Marketing enquiry forms use useLeadForm / submitLead and /api/leads. The app uses its separate authenticated /api/village endpoint: success means a durable in-app write, never an email or payment claim. Do not log payloads.
- Keep marketing content pages statically renderable. App routes and authenticated APIs are intentionally dynamic and private. Keep preview and pilot databases separate; never enable local preview role shortcuts on a public host.
- Preserve app request ownership checks, bounded validation, idempotency and transactional completion/referral rules. Clinical/community listings do not carry a fee. No browser storage for contact data or messages. App paths must remain excluded from analytics.
- Use existing design tokens, Button and Container. Add dependencies only for a clear need.
- Accessible labels, selection states, keyboard navigation, focus handling and reduced motion are required.
- Keep deployment, business and privacy limitations accurate in copy and README.

## Verification

Run npm test, npm run typecheck and npm run build. Audit dependencies when updating them. Browser-check mobile navigation, service filtering/details, the complete builder (including more than three services, cross-page adds, refresh, legacy query links, last-item removal and clear/undo), validation, and success/failure of each form using synthetic data and a local/mocked receiving service. Do not send test leads to production.
