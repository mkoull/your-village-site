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
Payloads carry a `type` field (`assessment` | `contact` | `waitlist`),
`submittedAt`, and `page`.

Until the variable is set, forms still show the confirmation screen but
log a warning to the console and deliver nothing — set it before launch.

## Deployment

Push to `main`; Vercel builds and deploys automatically. `vercel.json`
adds security headers (X-Frame-Options, nosniff, referrer policy).
