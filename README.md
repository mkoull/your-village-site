# Your Village — yourvillage.com.au

Marketing site for **Your Village**, a curated postpartum support service
in inner Melbourne. It takes a village — we build yours.

## Stack

Next.js 15 (App Router) + React 19 + Tailwind CSS 4. Static-first: every
route is prerendered at build time.

```
app/                Routes (/, /services, /services/[slug], /about,
                    /how-it-works, /get-started, /contact, /waitlist)
app/globals.css     Design tokens + bespoke animation CSS
components/home/    Homepage sections
components/layout/  Navbar, Footer
components/ui/      Button, Container, ScrollReveal
content/services.ts Single source of truth for services + testimonials
lib/leads.ts        Lead submission (all forms post through this)
lib/hooks.ts        Scroll reveal / scrolled / count-up hooks
```

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (prerenders all routes)
```

## Lead capture

Every form on the site (assessment at `/get-started`, `/contact`,
`/waitlist`, homepage email capture) posts JSON through
`lib/leads.ts` to a single webhook.

**Setup:** in Vercel → Project → Settings → Environment Variables, set

```
NEXT_PUBLIC_LEAD_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
```

then redeploy (the variable is inlined at build time). Any catch-hook
endpoint works — Zapier, Make, a Formspree endpoint, or your own API.
Payloads carry a `type` field (`assessment` | `quiz_step` | `contact` |
`waitlist`), `submittedAt`, and `page`.

- `assessment` payloads include the full answers, the suggested plan,
  a phone number when given, and an anonymous id.
- `quiz_step` payloads fire on EVERY answer (keyed to the same
  anonymous id), so families who drop out mid-quiz are still visible.
  Filter them into a separate sheet/tab from completed leads.
- TODO(mario): configure the webhook flow (Zapier/Make) to send the
  family a confirmation email on `assessment` submissions that repeats
  the promise: "a real person will reach out the same day, usually
  within a few hours."

Until the variable is set, forms still show the confirmation screen but
log a warning to the console and deliver nothing — set it before launch.

## Analytics

Vercel Analytics (`@vercel/analytics`) is mounted in the root layout —
enable it for the project in the Vercel dashboard. Custom events:
`quiz_started`, `quiz_step_completed`, `quiz_abandoned` (with step
number), `lead_submitted`, `pricing_viewed`, `faq_opened`.

## Deployment

Push to `main`; Vercel builds and deploys automatically. `vercel.json`
adds security headers (X-Frame-Options, nosniff, referrer policy).
