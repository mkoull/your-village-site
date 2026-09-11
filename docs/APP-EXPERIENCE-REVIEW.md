# App experience review — 11 September 2026

This pass follows a family from discovering support through saving, requesting, reading an offer and confirming receipt, then checks the corresponding provider and owner views. It preserves Village's circle identity, warm colours and existing service catalogue.

## Changes

- Account state, saved providers and confirmations live in the shared app layout. Saving updates the heart, count and village illustration immediately. Removal has Undo; failed saves restore the previous selection. Private state is scoped to account identity.
- Search understands service needs as well as provider names. Search, category and area survive navigation to a profile and back. Profile links return to the correct search, shortlist, conversation or workspace. Request forms reuse the chosen suburb.
- Availability requests have a review step, explicit sharing consent and a delivery acknowledgement. Editing preserves the draft and moves keyboard focus back to the form. Existing open conversations have a Continue action; paused saved providers remain readable and offer alternatives without accepting new requests.
- Requests show unread updates, the latest reply, progress and a role-specific next action. Needs you, In progress and Closed filters have useful empty states. Visible inboxes check for updates every 15 seconds; background refreshes retain form contents.
- Read acknowledgements record the last displayed event for the current account. They cannot acknowledge a different request or move backwards, and replies arriving later remain unread. An additive SQLite migration preserves legacy conversations; legacy events without an author identity do not acquire speculative unread flags.
- Preview account switches load the destination directly, avoiding a transient display of the previous account's conversation that could clear unread updates.
- Signing in after tapping a guest save finishes that save and returns to the intended profile. Password visibility is controllable, and opening the registration privacy notice preserves the form.
- Zero-dollar offers work throughout acceptance, delivery and confirmation, with explicit free-support wording and no referral estimate.
- Text, mobile spacing, status badges, conversation bubbles, page titles and SVG navigation icons are consistent. App components and store code are formatted for maintenance.

## Verification

`npm test`: 46 passing tests. The seven added tests cover unread ownership/concurrency, acknowledgement access and origin checks, migration/restart preservation, paused saved profiles, free support, search semantics and safe return paths. `npm run typecheck`, `npm run build` and `git diff --check` pass.

Browser checks used synthetic data only, at 320px, 390px and desktop widths:

- Save, remove, Undo and immediate navigation retain consistent counts and cards. The home illustration reflects actual saved categories.
- Search for cleaning in Richmond, open a profile and return to the same filtered results. Empty search recovers to all providers.
- Guest save resumes after example-account sign-in and returns with the provider saved.
- Review, edit, consent and send a request; preserve a typed follow-up and provider offer across automatic refreshes.
- Provider offer, family unread notification, opening clears only that conversation's unread state, acceptance, provider delivery and family completion. A free example completes without creating a fee; the earlier A$14 example ledger entry remains intact.
- Pause a saved example listing as owner, open it as family without a broken page or request form, then republish it. Workspace profile return links are retained.
- Family home, directory, saved providers, requests, profile, privacy and owner content have one H1 and no horizontal document overflow in the checked narrow layouts.
- After the production restart, session and saved data remain present. Request filters, search, remembered suburb, review/edit focus and navigation were checked again. Final production browser checks recorded no JavaScript errors.
- Existing website audit: 19 pages, 45 internal links/assets, two missing-page cases and three metadata resources; no failures.

## Scope and launch limits

This remains the local app preview on `codex/village-support-platform`, separate from the live marketing website. It is not a public app deployment. The providers and prices are fictional, messages stay in the app, and payments remain outside Village. Production storage/hosting, account recovery and verification, real notifications, an operational support contact and real provider onboarding remain launch work described in `VILLAGE-APP.md`.
