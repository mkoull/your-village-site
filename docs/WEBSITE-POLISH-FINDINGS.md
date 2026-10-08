# Public website polish — 8 October 2026

## Direction

Keep the distinctive forest, cream and lantern-gold palette, Newsreader/Jakarta typography and original eight-circle mark. Make the product feel considered through clear choices, useful return visits and calm hierarchy. No invented social proof, provider partnerships, availability or commercial claims.

## Implemented

- Homepage now recognises saved support and offers **Open my village**. The first-visit primary action remains **Build my village**, with an honest free/no-account note.
- Shortened the homepage: the founder story remains on About, where it can be read deliberately. Proposed Melbourne areas sit behind an optional disclosure. The emotional section now separates choosing help from the independent service examples.
- Rebuilt catalogue hierarchy around a visible search prompt, category filters, shorter category cards and clearly labelled saved state. A named independent starting point previews what the detail page contains; full provider instructions live on the detail and saved pages.
- **Add to my village** is idempotent. A saved action keeps focus and announces its saved/disabled state; clicking it again cannot silently remove a choice or progress. Explicit removal with Undo remains on My village. The builder's clearly labelled selection toggles remain available for editing choices.
- My village opens with one practical next action drawn from the existing service content. It focuses the corresponding saved card rather than sending someone into another questionnaire. Contacted/in-place states receive suitable follow-on wording.
- Improved the empty village with useful examples, stronger support-card separation, responsive spacing and readable storage information.
- Service detail pages present a visible practical first step above the independent service link. Provider independence, non-verification and direct confirmation of suitability/costs remain explicit.
- Unified public card treatment, softened saved-state styling, increased small-screen dock text, refined FAQ disclosure affordances and made the footer match the forest palette. Mobile footer navigation is in two readable columns.
- Added the footer path to `/mobile-app` (the root task owns that public explanation and native policy/support pages).
- Fixed duplicated brand text in service-page document titles and allowed error recovery buttons to wrap at narrow widths.

## Source review: launch needs beyond visual polish

1. **Real receiving service.** The lead forms have an honest unavailable state, but a public contact route cannot deliver support until credentials, sender configuration and actual inbox receipt are verified. The owner's private inbox must remain server-side.
2. **Product continuity.** Website shortlist, native device-only village and private account prototype are distinct storage/behaviour models. Public app copy needs to explain this and must not promise cross-device sync, bookings or provider messages from the current native build.
3. **More useful service coverage.** Current content links one independent starting point per category. This is a useful curated launch, not a verified marketplace. In particular, the broad wellbeing category currently points to a pregnancy/early-parenthood service; families outside that scope need additional suitable, reviewed starting points before broader coverage is claimed.
4. **Operational ownership.** A named process is needed for support replies, broken/outdated service links, complaints, provider applications and feedback. A polished interface cannot substitute for a working inbox and follow-up.
5. **Measure a meaningful pilot.** Observe whether families find a suitable service, make contact and return to use their saved support. Do not send personal support choices or progress to analytics. Validate paid provider relationships separately before introducing marketplace commissions or subscription claims.

## Verification

- Root TypeScript check passed.
- All 57 existing root tests passed after the functional changes.
- Formatting and `git diff --check` passed for this pass.
- The final public checkout passed all 36 website tests, TypeScript and its production build. Website checks passed on GitHub before publication. Release `fdfa7d8` is live, confirmed by Vercel's Production success and live browser checks. See `LAUNCH-READINESS-2026-10-08.md` for the 22-page responsive and end-to-end flow review, launch gaps and evidence limits. No physical-phone or inbox-delivery test is claimed.
