# Phase 04 — SR Engine (SM-2) + Flashcards + "Ôn hôm nay" + Exercise Runner

## Context links
- Plan: [plan.md](./plan.md) · Prev: [phase-03](./phase-03-renderers-topic-page-quiz.md)
- Brainstorm §5,§7,§8,§9: `/Users/duytang/Workspace/duy/math-learning-hub/plans/260817-brainstorm-math-learning-hub-summary.md`
- Ref store pattern: `cs-learning-hub/src/store/progress-store-with-persist.ts`

## Overview
- Date: 2026-08-17 · Priority: P1 · Status: pending · Review: not reviewed
- Description: Implement SM-2 as a pure TS module; a zustand-persist SR store keyed by card id; flashcard review UI (self-grade Again/Hard/Good/Easy); "Ôn hôm nay" page gathering all DUE cards+exercises interleaved across topics; exercise runner with 3 tiers, progressive hint reveal, step-by-step answers with ⚠️ common-mistake markers; focused single-topic drill mode.

## Key Insights
- SM-2 = pure functions (no React) → its own testable module (dev-rule: engine is own module).
- Interleaving = mix cards from different topics in the due queue (anti-fluency-illusion, per brainstorm §5).
- Exercises reuse `worked-example-block` styling for step-by-step answers (DRY).
- Progressive disclosure: hints reveal one-by-one; full solution unlocks only after user reveals/attempts (retrieval practice per §7).

## Requirements
Functional:
- SM-2: `review(card, grade)` → new `{easeFactor,interval,repetitions,dueDate}`. Grades Again/Hard/Good/Easy map to quality 2/3/4/5 (Again resets repetitions, keeps min ease 1.3).
- Store: per-card SR state persisted; `getDueCards(now)`; `gradeCard(id,grade)`; seed card state lazily on first review.
- Flashcard UI: flip front→back, four grade buttons, progress counter.
- "Ôn hôm nay": collects due flashcards + due exercises across ALL topics, interleaved (round-robin by topic); empty-state when nothing due.
- Exercise runner: tier filter (warmup/apply/challenge); progressive hints; reveal solution steps (⚠️ marker); mark ✅/link to related flashcard; optional self-grade feeds SR for `relatedFlashcard`.
- Drill mode: same runner filtered to one topic (`?topic=` or route param).
Non-functional: all state localStorage; works offline; mobile-first controls; each file < 200 lines.

## Architecture
- `spaced-repetition-sm2.ts` (pure): `SrCardState`, `Grade`, `initCardState()`, `review(state,grade,now)`, `isDue(state,now)`.
- `spaced-repetition-store.ts` (zustand persist, name `math-hub-sr`): `Record<cardId, SrCardState>` + actions; selectors `dueCardIds(now)`.
- `review-queue-builder.ts` (pure): given due card ids + card→topic map, return interleaved order.
- Flashcards: `flashcard-review-card.tsx` (flip + grade), `flashcard-deck-section.tsx` (topic-page deck).
- Review page: `pages/review-today-page.tsx` composes queue + flashcard/exercise renderers.
- Exercises: `exercise-runner.tsx` (tier + progression state machine), `exercise-card.tsx`, `progressive-hint-list.tsx`, `solution-steps-view.tsx` (⚠️/✅, reuses worked-example styling), `exercise-tier-filter.tsx`.
- Drill: `pages/topic-drill-page.tsx` reuses `exercise-runner` with topic filter.
- Data flow: content JSON → loader → flashcards/exercises → runner/deck → SR store (persist) → review page reads due set.

## Related code files
Create:
- `.../src/lib/spaced-repetition-sm2.ts`
- `.../src/lib/review-queue-builder.ts`
- `.../src/store/spaced-repetition-store.ts`
- `.../src/components/review/flashcard-review-card.tsx`
- `.../src/components/topic/flashcard-deck-section.tsx`
- `.../src/components/exercise/exercise-runner.tsx`
- `.../src/components/exercise/exercise-card.tsx`
- `.../src/components/exercise/progressive-hint-list.tsx`
- `.../src/components/exercise/solution-steps-view.tsx`
- `.../src/components/exercise/exercise-tier-filter.tsx`
- `.../src/pages/review-today-page.tsx`
- `.../src/pages/topic-drill-page.tsx`
- `.../src/lib/collect-due-items.ts` (gather flashcards+exercises across topics)
Modify:
- `.../src/pages/topic-page.tsx` (mount flashcard deck + exercise runner in P3 anchors)
- `.../src/router.tsx` (`/review`, `/drill/:areaId/:topicSlug`)
Delete: none.

## Implementation Steps
1. Implement `spaced-repetition-sm2.ts` (standard SM-2; clamp ease ≥1.3; Again→repetitions 0, interval 1d).
2. Unit-shape the grade→quality map + interval progression (repetition 1→1d, 2→6d, else round(prev*ease)).
3. Build `spaced-repetition-store.ts` (persist, lazy init per card, `gradeCard`, `dueCardIds`).
4. `review-queue-builder.ts` round-robin interleave by topic; `collect-due-items.ts` scans all topics' flashcards+exercises.
5. Flashcard UI: flip + 4 grades → `gradeCard`.
6. Exercise runner state machine: attempt → reveal hints (1..n) → reveal solution → self-grade related flashcard.
7. `solution-steps-view` renders numbered steps, ⚠️ on `isCommonMistake`, rule label, ✅ answer, 🔗 CS-relevance, 🃏 flashcard link.
8. Build `review-today-page` (interleaved) + `topic-drill-page` (filtered runner).
9. Mount deck + runner on topic page; wire routes.
10. Verify persistence across reload; verify due logic with a fake "now" injection.

## Todo list
- [ ] spaced-repetition-sm2.ts (pure) + grade map
- [ ] spaced-repetition-store.ts (persist)
- [ ] review-queue-builder + collect-due-items (interleave)
- [ ] flashcard-review-card + deck section
- [ ] exercise runner + card + hint list + solution view + tier filter
- [ ] review-today-page (interleaved)
- [ ] topic-drill-page (filtered)
- [ ] mount on topic page + routes
- [ ] persistence + due-date verification

## Success Criteria
- Grading a card reschedules `dueDate`; state survives reload (mobile + desktop).
- "Ôn hôm nay" shows only due items, mixed across ≥2 topics when available.
- Exercise hints reveal progressively; solution shows ⚠️ at the common-mistake step + ✅ answer.
- Drill mode restricts to a single topic.

## Risk Assessment
- localStorage growth with many cards → keys are small SR states; fine for single user (note: no cross-device sync — brainstorm §11).
- SM-2 edge cases (first review, Again loops) → cover with pure-function tests.
- Interleave starving one topic → round-robin, not random, guarantees fairness.

## Security Considerations
- Client-only; validate/guard against corrupt localStorage (parse defensively, reset card on schema mismatch). No user PII.

## Next Steps
- P5 surfaces "due today" counts in nav/home; P6 authors decks/exercises that feed this engine.
