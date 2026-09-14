# Village lights: quiet, reversible interaction

The forest scene uses translucent circular controls with service labels beneath them. A small inline plus changes to a check when selected; saved-page choices use an arrow because they open the existing support. There are no repeated Add pills. The central You light and warm selection glow remain the visual focus.

One instruction above the map adapts between Click and Tap. Hover lifts the circle and underlines its label; pressing depresses it, including while hovered. Keyboard focus and reduced-motion support remain. Circle and label belong to the same button, with full targets at least 44px.

The homepage keeps a reserved feedback area and a quiet next-step link. Adding or removing support does not move the map. The floating dock stays hidden on the homepage, where the header and scene link already lead to My village.

Validation on 14 September 2026:

- Desktop and phone screenshots at 1440px, 393px and 320px; no horizontal overflow. Narrow homepage and chooser hit regions do not overlap.
- At 320px, the homepage stays 550.58px high before and after removing a selected light. The narrow chooser's smallest target is 56.63px.
- Add/remove, keyboard Space, refresh persistence and continuation into My village checked. Opening a saved circle retains the selection and focuses its support card.
- Reduced-motion emulation reports no ripple animation and no orb transition. No browser JavaScript errors observed.
- Integration worktree: 49 tests, type checking and production build passed. Release checks must pass separately before publishing.

Phone checks use Chromium viewport emulation, not a physical device. The change is limited to the marketing scene; shared selection storage, providers, forms and the separate app prototype are unchanged.
