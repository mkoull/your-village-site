# CLAUDE.md — Your Village Website

## Project Overview

**Your Village** is the marketing site for a curated postpartum support
service in inner Melbourne, Australia. The service assembles and
coordinates vetted providers (meals, overnight carers, sleep and
lactation specialists, counselling, household help) around a family —
one conversation, one team, support simply arrives.

- **Domain**: yourvillage.com.au
- **Audience**: New and expecting parents in inner Melbourne
- **Positioning**: "It takes a village. We build yours."
- **Tone**: Warm, calm, reassuring — never clinical, salesy, or corporate.
  Inclusive of all family shapes and paths to parenthood.

## Architecture

Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + TypeScript.
Every route is statically prerendered (`npm run build` → 18 static routes).
Deployed on Vercel; `vercel.json` adds security headers.

### File Structure

```
app/layout.tsx            Root layout — fonts (Newsreader + Plus Jakarta Sans),
                          metadata, Navbar + Footer
app/page.tsx              Homepage — section order lives here
app/services/page.tsx     All services (category filter + expandable cards)
app/services/[slug]/      Per-service pages (SSG via generateStaticParams)
app/about/                Founder story
app/how-it-works/         Process page
app/get-started/          Support assessment (multi-step, contact LAST)
app/contact/              Simple contact form
app/waitlist/             Email + suburb capture
app/globals.css           Design tokens (:root) + bespoke animation CSS
components/home/          One file per homepage section
components/layout/        Navbar, Footer
components/ui/            Button, Container, ScrollReveal
content/services.ts       SINGLE SOURCE OF TRUTH: services + testimonials.
                          Navbar, Footer, services pages, assessment all
                          derive from it — never hardcode service lists.
lib/leads.ts              submitLead() — all form submissions go through this
lib/hooks.ts              useScrollReveal, useScrolled, useCountUp
```

### Homepage flow (a persuasion arc — each section has one job)

1. `Hero` — aurora canvas, "It takes a village. We build yours." + trust chips
2. `EmpathySection` — the "they get me" moment (3am inner monologue)
3. `ConstellationSection` — the problem → the model (orbiting services visual)
4. `ServicesPreview` — all services, compact linked cards
5. `EcosystemSection` — 3 steps + "what happens when you reach out" strip
6. `TrustSection` — vetting philosophy, 4 cards (no invented stats)
7. `FounderSection` — founder note pulled from the About story
8. `TestimonialsSection` — trio drawn from `content/services.ts`
9. `FaqSection` — objection handling (cost, vetting, inclusivity, gifting)
10. `WaitlistCapture` — dark final CTA, conversation-primary, email fallback
+ `StickyMobileCta` — mobile-only floating CTA after the hero

## Design System

Light, warm, editorial. Tokens are CSS custom properties in
`app/globals.css` `:root` and exposed to Tailwind (e.g. `bg-sage`,
`text-text-muted`, `bg-elevated`).

| Token                  | Value     | Usage                       |
|------------------------|-----------|-----------------------------|
| `--color-background`   | `#FAF8F5` | Page background             |
| `--color-surface`      | `#F3F0EB` | Alternating section bg      |
| `--color-dark`         | (near-black) | Footer + final CTA       |
| `--color-sage`         | `#8B9E7C` | Primary accent              |
| `--color-sage-dark`    | `#6B7E5C` | Hover accent                |

- **Headings**: Newsreader (serif) via `font-heading`
- **Body**: Plus Jakarta Sans via `font-body`
- Buttons are pill-shaped (`Button` component: primary / secondary / ghost)
- Scroll animations via `ScrollReveal` wrapper or `useScrollReveal`;
  all motion respects `prefers-reduced-motion`

## Lead Capture

All four capture points (assessment, contact, waitlist page, homepage
capture) call `submitLead(type, data)` from `lib/leads.ts`, which POSTs
JSON to `NEXT_PUBLIC_LEAD_WEBHOOK_URL` (set in Vercel env, inlined at
build time). Without it, forms show confirmation but deliver nothing and
warn in the console. Never bypass this helper with a page-local fetch.

## Conventions for AI Assistants

### Do

- Keep the warm, reassuring tone. This site serves exhausted, vulnerable
  families — gentle language, no urgency tactics, no exclamation marks.
- Use inclusive language: "parents", "families", "your family" — all
  family shapes and paths to parenthood. Australian English in copy.
- Derive anything service-related from `content/services.ts`.
- Use existing design tokens and components (`Button`, `Container`,
  `ScrollReveal`) rather than ad-hoc styles.
- Keep `/get-started` contact-details-last — that ordering is deliberate.
- Maintain accessibility: labels on inputs, `aria-expanded` on toggles,
  `prefers-reduced-motion` support, `:focus-visible` styling.
- Keep every route statically renderable (no server-only APIs).

### Don't

- Don't add npm dependencies without a strong reason — the site runs on
  Next/React/Tailwind alone.
- Don't invent statistics, provider counts, or response-time claims.
- Don't change the palette or fonts without explicit approval.
- Don't add tracking scripts or cookie banners unless asked; if
  analytics are requested, prefer privacy-friendly (Plausible/Fathom).
- Don't hardcode service names/links in components — import from content.
- Don't use emojis in code or copy.

### Testing

No test suite. Verify with `npm run build` (type + lint gate) and manual
checks: homepage sections reveal on scroll, assessment advances and
validates (contact details validate on the final step), mobile nav works
at 375px, service filter/accordion behave on `/services`.
