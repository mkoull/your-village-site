# Header refinement - 14 September 2026

The marketing header keeps the original eight-circle Village mark and introduces a single-line Newsreader wordmark: italic `your` with upright `village`, lighter weight and more generous spacing. A cream masthead, fine divider, forest action and aligned navigation carry the existing identity across desktop and mobile.

The header-specific brand variant leaves the app and footer lockups unchanged. Desktop navigation starts at 1024px to avoid crowding tablet widths. The mobile menu fills the available viewport, provides larger navigation targets, and uses a single column for primary links on the narrowest screens. Services, saved selections and destination URLs retain their existing behaviour.

## Validation

- Integration branch: 49 tests, TypeScript and production build passed.
- Chromium browser checks at 1440px, 1024px, 393px and 320px: no horizontal overflow; readable header and menu; saved count fits at 320px.
- Original nine SVG circles retained; header variant only changes the wordmark presentation.
- Services dropdown keyboard entry and Escape focus restoration, category navigation, homepage return and My village with a saved selection checked.
- Mobile menu keyboard focus wrap, Escape, background inert state, scroll lock and cleanup when returning to desktop checked.
- Header controls have at least 44px height; reduced-motion styles remove header transitions.
- No browser JavaScript errors observed. Phone checks use browser viewport emulation, not a physical iPhone.

Only marketing header changes are released to main; the separate app prototype is not part of this release.
