# Phase 05 — Progress Store + Home + Curriculum Nav + Responsive Layout

## Context links
- Plan: [plan.md](./plan.md) · Prev: [phase-04](./phase-04-spaced-repetition-and-exercises.md)
- Ref: `cs-learning-hub/src/store/progress-store-with-persist.ts`, `.../pages/home-*.tsx`, `.../components/home/*`, `.../components/layout/*`

## Overview
- Date: 2026-08-17 · Priority: P2 · Status: pending · Review: not reviewed
- Description: Port cs-hub progress store + home dashboard + collapsible area/unit/topic navigation + responsive app shell (desktop sidebar tree, mobile drawer). Surface per-area progress and a "Ôn hôm nay (N due)" entry point.

## Key Insights
- cs-hub already ships collapsible phase sections, topic cards w/ progress badges, sidebar tree, mobile drawer — port and rename phase→area/week→unit (DRY).
- Home should foreground the learning loop: "Continue" (last visited) + "Ôn hôm nay" due count.
- Progress store is separate from SR store (single responsibility).

## Requirements
Functional: home lists 7 areas → units → topic cards with read/quiz badges; sidebar tree navigates; mobile drawer toggles; last-visited "Continue" card; "Ôn hôm nay" shows due count from SR store; responsive at 375/768/1440.
Non-functional: no layout shift on nav; keyboard-accessible drawer; files < 200 lines.

## Architecture
- `progress-store-with-persist.ts` (name `math-hub-progress`): port; `markRead/setQuizScore/setLastVisited/viewMode/sidebarOpen`.
- Layout: `app-layout-shell.tsx` (sidebar + `<Outlet/>` + mobile top-bar), `sidebar-navigation-tree.tsx`, `mobile-navigation-drawer.tsx`.
- Home: `home-page.tsx` → `area-section-collapsible.tsx` → `topic-card-with-progress-badge.tsx` + `topic-card-icon.tsx`; add `review-today-cta.tsx` (reads SR due count) + `continue-learning-card.tsx`.
- Helpers: `completion-progress-helpers.ts` (per-area % complete).
- Data flow: curriculum tree + progress store + SR due count → home/sidebar.

## Related code files
Create (port + rename phase→area):
- `.../src/store/progress-store-with-persist.ts`
- `.../src/lib/completion-progress-helpers.ts`
- `.../src/components/layout/app-layout-shell.tsx`, `.../sidebar-navigation-tree.tsx`, `.../mobile-navigation-drawer.tsx`
- `.../src/components/home/area-section-collapsible.tsx`, `.../topic-card-with-progress-badge.tsx`, `.../topic-card.tsx`, `.../topic-card-icon.tsx`
- `.../src/components/home/review-today-cta.tsx`, `.../continue-learning-card.tsx`
- `.../src/components/ui/progress-bar.tsx`, `.../completion-badge.tsx` (port)
- `.../src/pages/home-page.tsx` (replace P1 placeholder)
Modify: `.../src/router.tsx` (finalize routes: `/`, `/area/:areaId/:topicSlug`, `/review`, `/drill/...`). Delete: P1 placeholder home body (overwrite).

## Implementation Steps
1. Port progress store (rename storage key + phase→area terminology).
2. Port layout shell + sidebar tree + mobile drawer; bind to curriculum areas.
3. Port `completion-progress-helpers` for per-area completion %.
4. Port home collapsibles + topic cards + icons; wire read/quiz badges from progress store.
5. Build `review-today-cta` (due count from SR store) + `continue-learning-card` (last visited).
6. Assemble `home-page.tsx`; finalize routes.
7. Responsive pass at 375/768/1440; verify drawer a11y (focus trap, ESC close).
8. Update `./docs/system-architecture.md` nav/state diagram; changelog entry.

## Todo list
- [ ] progress store port (math-hub-progress)
- [ ] layout shell + sidebar tree + mobile drawer
- [ ] completion-progress-helpers
- [ ] home collapsibles + topic cards + icons
- [ ] review-today-cta + continue-learning-card
- [ ] home-page assembled + routes finalized
- [ ] responsive + drawer a11y pass
- [ ] docs updated

## Success Criteria
- All 7 areas navigable; topic cards show read/quiz state; per-area % correct.
- "Ôn hôm nay" CTA shows accurate due count and routes to review page.
- Usable and non-overflowing at 375px, 768px, 1440px.

## Risk Assessment
- SR due count recompute cost on home → memoize/select once; cheap for single-user data.
- Deep curriculum tree overflow on mobile → drawer scroll + collapsible units.

## Security Considerations
- Client-only; guard corrupt persisted progress (defensive parse; reset on mismatch).

## Next Steps
- P6 authoring populates cards so home/nav reflect real content; badges/counts go live.
