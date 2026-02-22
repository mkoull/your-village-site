# Homepage Redesign Plan — Apple-Inspired Flow

## Problem
The homepage has too many sections saying similar things, inconsistent backgrounds, and the constellation animation feels misplaced as the hero. The flow doesn't feel smooth or cinematic.

## Design Philosophy
Apple's approach: **one idea per screen, maximum breathing room, cinematic motion, ruthless simplicity.** Every section earns its place. No filler.

---

## Section Flow (Before → After)

### BEFORE (9 sections, redundant):
1. VillageHero (constellation + text)
2. RestSection ("Rest shouldn't feel out of reach")
3. EcosystemSection (3 steps)
4. NotATodoSection ("The model" — text only)
5. TrustSection (4 trust cards)
6. StatsSection (4 metrics)
7. TestimonialsSection (3 quotes)
8. SupportFinder (quiz)
9. WaitlistCapture (email signup)

### AFTER (7 sections, no filler):
1. **Hero** — Clean, Apple-style. Aurora canvas background, large serif headline, two CTAs. No constellation here.
2. **The Model** — Constellation animation lives here. "An ecosystem, not a to-do list." The constellation visually demonstrates the model.
3. **How It Works** — 3 steps, tightened.
4. **Trust + Stats** — Combined into one visual section. 4 trust points as a horizontal strip, stats as large counters below.
5. **Testimonials** — Larger quotes, more breathing room.
6. **Support Finder** — Interactive quiz stays.
7. **Final CTA** — Dark section, waitlist capture + "Talk to us" button.

---

## Detailed Changes

### 1. Hero — Cinematic Simplicity
- **Remove** constellation from hero
- **Restore** AuroraCanvas as background (soft animated gradient orbs)
- Large display heading: "You don't have to do this alone."
- Subtext + two CTAs
- Hero reveals staggered (eyebrow → heading → body → buttons)
- Full viewport height, vertically centered
- **Apple touch**: Add a subtle scroll indicator (thin line or chevron) at bottom

### 2. The Model — Constellation Section
- **Move** constellation animation here where it makes contextual sense
- Left side: "The model" heading + explanatory text
- Right side: The constellation animation (showing services orbiting "Your family")
- Change center text from "Your Village" to "Your Family" (makes more sense contextually)
- Desktop: side-by-side layout (text left, constellation right)
- Mobile: stacked (text top, constellation below)
- Constellation triggers animation on scroll into view (not page load)
- Background: white, clean

### 3. How It Works — Tightened
- Keep 3-step cards
- Slightly larger step numbers (more prominent)
- Background: subtle surface color

### 4. Trust + Stats — Combined
- **Merge** TrustSection + StatsSection into one flowing section
- Top: 4 trust points as minimal icon + label (horizontal on desktop, 2x2 on mobile)
- Bottom: 4 stat counters, large numbers with labels
- Background: white
- This avoids two thin sections back-to-back

### 5. Testimonials — More Breathing Room
- Larger quote text
- Add subtle quotation mark decoration
- Keep 3 quotes but space them more
- Background: surface color

### 6. Support Finder — Keep As-Is
- Already works well as interactive element
- Minor: fix step 2 option count (reduce from 6 to 4)

### 7. Final CTA — Dark Section
- Merge WaitlistCapture messaging
- Dark background with warm accent
- Email capture + primary CTA button

---

## CSS & Style Changes

### Background Rhythm (cleaner alternation):
```
Hero          → transparent (aurora canvas)
The Model     → white
How It Works  → surface (#F3F0EB)
Trust+Stats   → white
Testimonials  → surface
Quiz          → white
Final CTA     → dark (#1A1918)
Footer        → dark
```

### Apple-Inspired Polish:
- **Navbar**: Add backdrop blur (`backdrop-filter: blur(12px)`) with slight transparency
- **Scroll reveals**: Increase translateY from 24px to 40px for more dramatic entrance
- **Section spacing**: Increase to `py-24 md:py-32 lg:py-40` for more breathing room
- **Typography**: Bump display size slightly, increase letter-spacing on headings

### Remove RestSection + NotATodoSection
- Content from RestSection merged into hero subtext
- NotATodoSection content merged into The Model section text
- Two fewer sections = tighter, more impactful flow

---

## Files to Modify

1. `app/page.tsx` — New section order, remove RestSection + NotATodoSection imports
2. `components/home/Hero.tsx` — Restore clean hero with AuroraCanvas
3. `components/home/VillageHero.tsx` → Rename to `ConstellationSection.tsx` — Inline constellation for "The Model"
4. `components/home/NotATodoSection.tsx` — Delete (merged into ConstellationSection)
5. `components/home/RestSection.tsx` — Delete (merged into Hero)
6. `components/home/TrustSection.tsx` — Combine with StatsSection
7. `components/home/StatsSection.tsx` — Combine with TrustSection
8. `app/globals.css` — Update constellation CSS, add Apple polish, fix backgrounds
9. `components/layout/Navbar.tsx` — Add backdrop blur on scroll

## Files NOT Modified
- Service pages, about, contact, get-started, waitlist — unchanged
- Footer — unchanged
- Content data — unchanged
