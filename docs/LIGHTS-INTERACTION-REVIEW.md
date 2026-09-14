# Village lights: clear actions and steady feedback

The homepage map keeps the forest palette, circle logo and warm glow, with a clearer invitation and visible actions on every light. Each single button contains the service icon, name and a cream `+ Add` label. A selection lights the circle and path, changes the action to `Added`, and updates the central count. Clicking again removes it. On the saved page, selected lights say `Open` and retain the existing non-destructive exploration behaviour.

The homepage caption confirms both additions and removals. Its reserved space and the consistently sized next-step link prevent the map moving after a selection. The next step opens My village with the current choices; the empty state offers service browsing. The redundant floating dock is hidden on the homepage, where the header and map already offer access to My village.

Narrow maps have more vertical spacing to avoid overlapping tap regions. SVG paths follow the same responsive layout. Pointer hover, keyboard focus, pressed states and reduced-motion support remain. Selection storage, provider data, forms and analytics are unchanged.

Validation on 14 September 2026:

- Browser screenshots of desktop and phone layouts, including selected and empty states.
- No horizontal overflow or overlapping map hit regions at 1440px, 1024px, 768px, 393px and 320px on the saved page; homepage and narrow chooser checked as well.
- Full light buttons exceed the 44px touch target minimum. Both the circle and its Add label activate the same button.
- Add/remove with pointer, Enter and Space; immediate matching light/path/count feedback without navigation.
- Four homepage choices survive refresh, continue into My village, and accept an additional choice without losing previous selections.
- Opening an existing saved light focuses its service without removing it. Clear/undo restores all selections. Removing the final homepage choice restores the browse link.
- Homepage card height and map position remain identical across selection changes at 393px. No floating dock obscures the map.
- Reduced-motion emulation reports no ripple animation and no orb transition. No browser JavaScript errors observed.
- Integration worktree: 49 tests, type checking and production build passed. Release worktree must pass its own tests, type checking and production build before publication.

Phone checks use Chromium viewport emulation, not a physical phone. Only these marketing-site changes are released; the separate app prototype remains isolated.
