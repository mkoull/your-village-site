# Village lights: discoverable controls

The homepage light map read as an illustration: the instruction was below the
map and the small, low-contrast plus badges were easy to miss.

The invitation now appears above the map, using Click for desktop pointer input
and Tap for narrow/touch layouts. Cream plus badges, clearer orb edges, a small
hover lift and underline, keyboard outlines and a pressed response distinguish
the controls without changing the forest palette or the saved gold glow.
Badges use SVG for consistent rendering. The saved-page map uses an arrow for
an existing choice because that control opens support rather than removing it.

No selection, persistence, analytics or form logic changed. Existing reduced
motion rules apply. Even the narrowest orbs are at least 44px; the full button
also includes the service label.

Validation on 14 September 2026:

- Browser screenshots at 1440px, 393px and 320px; no horizontal overflow.
- Visible instruction, contrasting plus badges and desktop hover response.
- Click and keyboard Enter/Space toggle lights and paths without navigation.
- Four selections survive refresh and transfer into the builder and My village.
- All map targets are at least 44 by 44px in the narrow layouts.
- Reduced-motion emulation produces no ripple animation.
- No browser JavaScript errors. The integration worktree passes 49 tests; the website release passes all 28 of its tests. Both pass type checking and production builds.
