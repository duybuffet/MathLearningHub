# Phase 06 — Content Authoring Track (areas 1-3 first, then 4-7)

## Context links
- Plan: [plan.md](./plan.md) · Prev: [phase-05](./phase-05-navigation-home-layout.md)
- Schema: [phase-02](./phase-02-content-schema-and-loader.md) · Renderers: [phase-03](./phase-03-renderers-topic-page-quiz.md) · SR/exercises: [phase-04](./phase-04-spaced-repetition-and-exercises.md)
- Sample topic template: `cs-learning-hub/src/content/phase4/math-for-algorithms.json`
- Brainstorm §6-§8 (lesson/exercise/answer format): `plans/260817-brainstorm-math-learning-hub-summary.md`

## Overview
- Date: 2026-08-17 · Priority: P2 (bulk effort) · Status: pending · Review: not reviewed
- Description: Author one JSON per topic (intuition-first, NOT proof-heavy) for 7 areas (~34 topics). Each topic: sections (intro→analogy→formula/explanation→graph→worked_example(2-3)→callout(common mistakes)→key_takeaways), flashcards, 3-tier exercises with progressive hints + step-by-step answers (⚠️ common-mistake marker), MCQ quiz. Priority order: areas 1,2,3 (foundation) → 4,5,6,7. Register each in `curriculum.json` by setting its `file`.

## Key Insights
- Adding a topic = add JSON + set `file` in curriculum. No code change (loader is glob-eager) → each topic is an independent, shippable unit.
- Interactive `graph` ONLY where it adds value (areas 1-2 functions, area 5 distributions); else static/mermaid (YAGNI).
- Answer format is the retention lever: every solution step names the rule; mark the pitfall step with `isCommonMistake`; end with ✅ + 🔗 CS relevance + 🃏 flashcard link.
- Every flashcard referenced by an exercise's `relatedFlashcard` must exist in that topic's deck.

## Requirements
Functional (per topic): valid `MathTopic` JSON; renders end-to-end; ≥3 flashcards; ≥3 exercises spanning all tiers; ≥5 MCQ; formulas render; graphs (where present) interactive.
Non-functional: Vietnamese content, intuition-first; each JSON self-contained; prerequisites listed; consistent icons.

## Architecture / Sub-phases (author in this order)

### 6a — Area 1: Đại số & Hàm số (foundation, do first)
1. luy-thua-va-can (powers & roots)
2. logarit (logarithm — log↔complexity) [graph]
3. ham-tuyen-tinh-va-bac-hai (linear & quadratic functions) [graph]
4. ham-mu-va-ham-log (exp & log functions) [graph]
5. doc-do-thi-ham-so (reading graphs) [graph]

### 6b — Area 2: Giải tích nhẹ
1. gioi-han-truc-quan (limits via graphs/tables) [graph]
2. dao-ham-la-toc-do-thay-doi (derivative as rate of change) [graph]
3. quy-tac-dao-ham (differentiation rules)
4. tich-phan-co-ban (basic integrals — area under curve) [graph]

### 6c — Area 3: Đại số tuyến tính
1. vector-co-ban (vectors)
2. ma-tran-va-phep-nhan (matrices & multiplication)
3. dinh-thuc (determinant)
4. ma-tran-nghich-dao (inverse)
5. he-phuong-trinh-tuyen-tinh (linear systems)

### 6d — Area 4: Toán rời rạc ⭐
1. logic-menh-de (propositional logic) [mermaid truth tables]
2. tap-hop-quan-he-ham (sets/relations/functions)
3. quy-nap-nhe (light induction)
4. to-hop-dem (combinatorics/counting)
5. he-thuc-truy-hoi (recurrences)

### 6e — Area 5: Xác suất & Thống kê
1. xac-suat-co-ban (basic probability)
2. bien-ngau-nhien (random variables)
3. ky-vong-va-phuong-sai (expectation/variance) [graph distributions]
4. dinh-ly-bayes (Bayes)

### 6f — Area 6: Đồ thị
1. dinh-va-canh (vertices/edges) [mermaid]
2. bieu-dien-do-thi (representations: adjacency matrix/list) [mermaid]
3. duyet-do-thi (traversal BFS/DFS) [mermaid]
4. cay (trees) [mermaid]

### 6g — Area 7: Toán cho Thuật toán 🔑
1. big-o-va-tiem-can (Big-O/asymptotics) [graph growth curves]
2. so-hoc-modulo (modular arithmetic)
3. gcd-va-so-nguyen-to (GCD/primes) [mermaid]
4. he-thuc-truy-hoi-va-master (recurrences & Master theorem)

(~34 topics. Trim area 6/7 last if MVP time-boxed — see plan Unresolved Q2.)

## Related code files
Create: one JSON per topic under `.../src/content/area{N}/{unit}-{slug}.json` (filename kebab-case, self-descriptive, mirrors cs-hub `phaseN/weekN-...json`).
Modify: `.../src/content/curriculum.json` (set each topic's `file` as authored).
Create (once): `.../docs/content-authoring-guide.md` (section-order + answer-format checklist).
Delete: none.

## Implementation Steps
1. Write `content-authoring-guide.md`: canonical section order, KaTeX conventions, flashcard/exercise/answer-format rules (from brainstorm §6-§8).
2. Author area 1 topic-by-topic; after each, set `file`, preview in app, verify renderers + SR wiring.
3. Cross-check every `relatedFlashcard` id exists in the topic deck.
4. Repeat for areas 2→7 in the order above.
5. After each area: update `./docs/development-roadmap.md` progress + `project-changelog.md`.
6. Spot-check formulas/graphs on mobile per authored topic.

## Todo list
- [ ] content-authoring-guide.md
- [ ] 6a Area 1 (5 topics) + register files
- [ ] 6b Area 2 (4 topics)
- [ ] 6c Area 3 (5 topics)
- [ ] 6d Area 4 (5 topics)
- [ ] 6e Area 5 (4 topics)
- [ ] 6f Area 6 (4 topics)
- [ ] 6g Area 7 (4 topics)
- [ ] relatedFlashcard integrity check (all areas)
- [ ] docs roadmap/changelog updated per area

## Success Criteria
- Areas 1-3 fully authored + rendering (foundation MVP); areas 4-7 authored or clearly staged.
- Every topic: renders all its section types, ≥3 flashcards, tiered exercises with ⚠️ answers, ≥5 MCQ.
- User can complete the full loop (LEARN→RECALL→PRACTICE→SPACE) on any published topic.

## Risk Assessment
- Authoring is the true cost (brainstorm §11) → prioritize 1-3; each topic independent so partial ship is fine.
- Math correctness → self-review each worked example + quiz answer; keep intuition-first (no epsilon-delta).
- KaTeX escaping in JSON (backslashes) → double-escape; lint by rendering in-app before commit.

## Security Considerations
- Authored KaTeX rendered with `trust:false`; no HTML/`\href` in formula strings. Content is static, no user input.

## Next Steps
- Post-authoring: full responsive QA pass; optional future = cross-device SR sync (out of scope, brainstorm §11).
