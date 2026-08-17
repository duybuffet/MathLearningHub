---
title: "Math Learning Hub — Implementation Plan"
description: "Self-contained React+Vite+TS site to re-learn CS-foundational math; intuition-first content, KaTeX formulas, interactive graphs, SM-2 spaced repetition."
status: pending
priority: P2
effort: 118h
branch: main
tags: [react, vite, typescript, education, math, spaced-repetition]
created: 2026-08-17
---

# Math Learning Hub

Mirror `cs-learning-hub` stack + pattern. No backend; progress + SR state in localStorage.
Responsive mobile+desktop. Content = one JSON per topic, indexed by `curriculum.json`
(area → unit → topic). Learning loop per topic: LEARN → RECALL(flashcards) →
PRACTICE(exercises) → SPACE(SM-2). Ref repo (read-only): `/Users/duytang/Workspace/duy/cs-learning-hub`.

## Phases

| # | Phase | Effort | Status | Progress | File |
|---|---|---|---|---|---|
| 1 | Project scaffold (configs, deps, routing shell, theme, docs) | 8h | pending | 0% | [phase-01-project-scaffold.md](./phase-01-project-scaffold.md) |
| 2 | Content schema types + loader + curriculum skeleton (7 areas) | 8h | pending | 0% | [phase-02-content-schema-and-loader.md](./phase-02-content-schema-and-loader.md) |
| 3 | Section renderers (formula/graph/worked_example) + topic page + quiz | 14h | pending | 0% | [phase-03-renderers-topic-page-quiz.md](./phase-03-renderers-topic-page-quiz.md) |
| 4 | SR engine (SM-2 + store) + flashcards + Ôn hôm nay + exercise runner | 16h | pending | 0% | [phase-04-spaced-repetition-and-exercises.md](./phase-04-spaced-repetition-and-exercises.md) |
| 5 | Progress store + home + curriculum nav + responsive layout | 12h | pending | 0% | [phase-05-navigation-home-layout.md](./phase-05-navigation-home-layout.md) |
| 6 | Content authoring track (areas 1-3 first, then 4-7) | 60h | pending | 0% | [phase-06-content-authoring-track.md](./phase-06-content-authoring-track.md) |

## Key dependencies

- P1 → all (scaffold + deps must exist first).
- P2 → P3, P4, P6 (schema types are the shared contract).
- P3 depends on P2; P4 depends on P2 + P3 (flashcards/exercises live on topic page).
- P5 depends on P2 (curriculum tree) + P4 (SR store for "due" badges); can start UI after P2.
- P6 depends on P2 (schema) + P3 (renderers to preview) + P4 (flashcard/exercise shapes).
  Bulk effort; incremental — each topic JSON is independent, no code change to add one.

## Global constraints (user dev rules)

- Every code file < 200 lines; split components/modules; SR engine is its own TS module.
- kebab-case, self-descriptive filenames.
- DRY / KISS / YAGNI. Interactive graphs only where they add value; else static/mermaid.
- Maintain `./docs` per documentation-management convention (roadmap, changelog, arch, standards).

## Resolved Decisions (2026-08-17)

- **UI language = bilingual terms.** Vietnamese labels/chrome, with English CS/math term in
  parentheses on first use where helpful, e.g. "Giới hạn (limit)", "Độ phức tạp (Big-O)".
  Applies to nav/buttons AND content headings. Renderers (P3) + authoring rules (P6) follow this.
- **MVP scope = all 7 areas.** Full curriculum before "done"; still author in priority order
  1→2→3→4→5→6→7 (foundation first) but no area trimmed. ~34 topics stand.

## Unresolved Questions

1. Should "focused single-topic drill" reuse the exercise runner with a topic filter, or be a
   distinct page? (plan assumes: same runner, `?topic=` filter — confirm).
2. KaTeX macro set — any shared `\newcommand` macros needed across topics (e.g. `\Or`, vectors)?
3. Deploy target — reuse cs-hub `vercel.json` as-is? (assumed yes).
4. Analytics / no-analytics — cs-hub has none; assume none.
