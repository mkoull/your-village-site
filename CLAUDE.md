# CLAUDE.md — Your Village Website

## Project Overview

**Your Village** is a static marketing website for a postpartum support coordination service based in inner Melbourne, Australia. The site connects new families with vetted providers (doulas, lactation consultants, sleep specialists, etc.) through a personal coordinator model.

- **Domain**: yourvillage.com.au
- **Audience**: New and expecting parents in inner Melbourne
- **Tone**: Warm, calm, reassuring — never clinical or corporate

## Architecture

This is a **zero-build static site** — plain HTML, CSS, and vanilla JavaScript. There is no framework, no bundler, no package.json, and no node_modules.

### File Structure

```
index.html          Homepage — hero, value prop, stats, how-it-works, trust,
                    pricing packages, reassurance, FAQ, final CTA
about.html          About page — founder story, provider vetting philosophy
get-started.html    Intake form — 6-step multi-step form with client-side validation
styles.css          Single shared stylesheet (all pages link to this)
favicon.svg         SVG favicon — "village nest" circle icon
vercel.json         Vercel deployment config (clean URLs + security headers)
README.md           Deployment and integration instructions
```

### Key Architectural Decisions

- **No build step**: Files are served as-is. Deploy by pushing to GitHub and connecting to Vercel or Netlify.
- **Single CSS file**: All styles live in `styles.css`. There is no CSS preprocessor, no CSS modules, no utility framework.
- **Inline JavaScript**: Each HTML page has its own `<script>` block at the bottom of `<body>`. There are no external JS files.
- **No dependencies**: No npm packages, no CDN libraries. Only external resources are Google Fonts (DM Sans + Lora).

## Design System

The site uses a **"Bedroom at Night"** design language — dark backgrounds, warm muted tones, low contrast, and soft sage green accents.

### Color Palette (CSS custom properties in `:root`)

| Token              | Value       | Usage                          |
|--------------------|-------------|--------------------------------|
| `--night-bg`       | `#1E1D1B`  | Page background                |
| `--night-surface`  | `#2A2826`  | Card/component backgrounds     |
| `--night-card`     | `#332F2C`  | Elevated card backgrounds      |
| `--night-border`   | `#3E3A36`  | Borders                        |
| `--sage`           | `#8FAF8F`  | Primary accent (buttons, links)|
| `--sage-glow`      | `#A3C4A3`  | Hover/active accent            |
| `--text-primary`   | `#EDE8DF`  | Headings, strong text          |
| `--text-secondary` | `#B5AFA6`  | Body text                      |
| `--text-muted`     | `#8A8279`  | Captions, metadata             |

### Typography

- **Headings**: `Lora` (serif), weight 600
- **Body**: `DM Sans` (sans-serif), weight 400/500/600
- Base font size: 17px mobile, 18px desktop (768px+ breakpoint)

### Spacing

8px base scale using CSS custom properties: `--space-xs` (8px) through `--space-3xl` (72px).

### Layout Constraints

- `--page-max`: 1080px (outer content width)
- `--content-max`: 680px (text/reading width)
- Single breakpoint at `768px` for mobile/desktop transitions

### Component Patterns

- **`.card-section`**: Rounded cards with dark background, border, and shadow
- **`.btn-primary`**: Sage green pill button; `.btn-secondary`: outlined variant; `.btn-sm`: compact size
- **`.steps-grid`**: 3-column grid on desktop, stacked on mobile
- **`.packages-grid`**: 3-column pricing cards; `.package-card--featured` gets a sage border and badge
- **`.faq-item`**: Accordion pattern with `aria-expanded` toggling

## Pages

### `index.html` (Homepage)

Sections in order: Nav, Hero, Value proposition, Stats (animated count-up), How it works (3 steps), Trust & vetting, Founder note, Packages/pricing, Reassurance, FAQ, Final CTA, Footer.

**JavaScript features:**
- Sticky nav scroll effect (adds `.scrolled` class at 40px)
- FAQ accordion (single-open, `aria-expanded` managed)
- Smooth-scroll for anchor links
- Mobile hamburger menu toggle
- Stats count-up animation (IntersectionObserver-triggered, respects `prefers-reduced-motion`)

### `about.html` (About Page)

Static content page. Nav is permanently in `.scrolled` state. Only JS is hamburger menu toggle.

### `get-started.html` (Intake Form)

6-step multi-step form collecting: baby date, suburb, needs (multi-select), support network, contact preference, contact details (name/email/phone).

**JavaScript features:**
- Step-by-step navigation with `data-next`/`data-back` button attributes
- Per-step validation with `.field-error.visible` toggling
- Enter key advances steps
- Form submission POSTs JSON to a webhook URL (currently placeholder `YOUR_ZAPIER_WEBHOOK_URL`)
- Shows `.form-confirmation` on submit, hides form

**Backend integration**: The form submission block at line ~494 of `get-started.html` is a placeholder. See the `BACKEND INTEGRATION POINT` comment for options (Zapier, Make, Netlify Forms, Google Sheets).

## Deployment

### Vercel (primary)

Configured via `vercel.json`:
- `cleanUrls: true` — serves `.html` files without extension (e.g., `/about` serves `about.html`)
- Security headers on all routes: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`

### Netlify (alternative)

The README references Netlify as an option. A `netlify.toml` may have existed previously but is not currently in the repo.

## Conventions for AI Assistants

### Do

- Maintain the warm, reassuring tone in all copy. This site serves vulnerable families — language should be gentle, never salesy or clinical.
- Keep the zero-build architecture. Do not introduce npm, webpack, or any build tooling unless explicitly requested.
- Use the existing CSS custom properties for colors, spacing, and sizing. Do not hardcode values.
- Follow the existing naming conventions: BEM-like class names (e.g., `.package-card--featured`, `.stats-number--static`).
- Put all styles in `styles.css`. Do not add `<style>` blocks to HTML files.
- Keep inline `<script>` blocks at the bottom of `<body>` in each HTML page.
- Maintain accessibility: `aria-expanded` on toggles, `aria-label` where needed, `:focus-visible` styling, `prefers-reduced-motion` support.
- Replicate the nav, footer, and font/meta includes exactly when creating new pages. The nav SVG logo, link structure, and mobile menu pattern are consistent across all pages.
- Use Australian English spelling (e.g., "organisation", "colour" in copy — though CSS property names stay American English).
- Internal links use clean URLs without `.html` extension (e.g., `/get-started`, `/about`).

### Don't

- Don't add JavaScript frameworks or libraries. The site is intentionally vanilla.
- Don't introduce CSS utility frameworks (Tailwind, etc.). All styling goes through the existing design token system in `styles.css`.
- Don't change the color palette without explicit approval — it's a carefully curated dark theme.
- Don't add cookie banners or tracking scripts without being asked. Privacy-friendly analytics (Plausible/Fathom) are recommended if analytics are needed.
- Don't modify the form webhook URL without being told the replacement value.
- Don't use emojis in code or copy unless explicitly asked.

### Adding New Pages

1. Copy the `<head>` block from `about.html` (update `<title>`, `<meta>`, and `<link rel="canonical">`)
2. Copy the nav block (use `/#section` links for homepage sections, same as `about.html`)
3. Copy the footer block
4. Add the hamburger JS snippet at the bottom
5. The nav should have class `scrolled` permanently on sub-pages (not the homepage)

### Testing

There is no test suite. Manual verification:
- Open each `.html` file in a browser
- Check mobile responsiveness at 375px and 768px breakpoints
- Verify FAQ accordion opens/closes correctly
- Verify form steps advance and validate properly
- Verify stats count-up animation triggers on scroll
