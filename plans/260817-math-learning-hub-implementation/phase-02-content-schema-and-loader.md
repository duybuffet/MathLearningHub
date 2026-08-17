# Phase 02 — Content Schema Types + Loader + Curriculum Skeleton

## Context links
- Plan: [plan.md](./plan.md) · Prev: [phase-01](./phase-01-project-scaffold.md)
- Ref schema: `cs-learning-hub/src/types/content-schema-types.ts`
- Ref loader: `cs-learning-hub/src/lib/content-loader.ts`

## Overview
- Date: 2026-08-17 · Priority: P1 (shared contract) · Status: pending · Review: not reviewed
- Description: Extend cs-hub content schema with math section types + flashcards + exercises; port the glob-eager content loader (phase→area rename); write `curriculum.json` skeleton indexing all 7 areas → units → topics (files omitted until authored).

## Key Insights
- Loader renders a topic only when its curriculum entry has a `file` → authoring is incremental, no code changes to add a topic.
- Keep existing section types intact (DRY); only ADD `formula`, `graph`, `worked_example`.
- `id` convention becomes `area{N}_{slug}` (mirrors cs-hub `phase1_...`).

## Requirements
Functional: TS types compile; `getCurriculum()`, `loadTopicByFile()`, `findTopicEntry()`, `flatTopicList()`, `topicIdFor()` work against area-shaped curriculum; a hand-written sample topic type-checks.
Non-functional: strict types, no `any`; each type file < 200 lines (split if needed).

## Architecture
- `content-schema-types.ts`: extended discriminated unions.
- New section fields (optional, so one `ContentSection` interface stays DRY):
  - `formula`: `latex: string`, `reading: string` ("đọc là…"), `symbols?: {sym:string; meaning:string}[]`.
  - `graph`: `fnConfig` (function-plot options subset: `data[]{fn,color}`, `xDomain?`, `yDomain?`), `params?` (named sliders `{name,min,max,step,default}`), `caption?`.
  - `worked_example`: `prompt: string`, `steps: string[]` (each may embed KaTeX + `⚠️`), `result: string`.
- New top-level types: `Flashcard`, `Exercise`, `ExerciseDifficulty`, `SolutionStep`.
- `MathTopic` extends cs-hub `TopicContent`: replaces `phase/week` with `area/unit/order`, adds `prerequisites[]`, `flashcards[]`, `exercises[]` (quiz/sections/visualizer kept).
- Curriculum tree renamed: `MathCurriculum{areas[]}`, `CurriculumArea{id,title,icon,units[]}`, `CurriculumUnit{id,title,topics[]}`, `CurriculumTopic{slug,title,file?}`.

## Related code files
Create:
- `.../src/types/content-schema-types.ts` (extended; if >200 lines split into `content-schema-types.ts` + `curriculum-tree-types.ts`)
- `.../src/lib/content-loader.ts` (port; phase→area)
- `.../src/content/curriculum.json` (skeleton, 7 areas, topics without `file`)
- `.../src/content/.gitkeep` per area dir: `area1/`…`area7/`
Modify: none. Delete: none.

## Implementation Steps
1. Copy cs-hub schema; keep `SectionType` union, ADD `'formula' | 'graph' | 'worked_example'`.
2. Add optional fields to `ContentSection` for the 3 new types (KISS: one interface, optional props — mirrors cs-hub style).
3. Define `Flashcard {id,front,back,type:'concept'|'formula'|'definition'}`.
4. Define `SolutionStep {text:string; rule?:string; isCommonMistake?:boolean}` and `Exercise {id,difficulty,prompt,hints[],solutionSteps:SolutionStep[],answer,commonMistake,relatedFlashcard?}`.
5. Define `MathTopic` (area/unit/order/prerequisites/flashcards/exercises + kept fields).
6. Rename curriculum tree types (area/unit). Update loader: `findTopicEntry(areaId,slug)`, `flatTopicList()`, `topicIdFor(areaId,slug)`; keep glob eager pattern.
7. Author `curriculum.json` skeleton — 7 areas, proposed units + topic slugs/titles from phase-06 checklist, `file` omitted.
8. Type-check one sample `MathTopic` literal in a scratch test, then delete scratch.

## Todo list
- [ ] Extend SectionType + ContentSection (formula/graph/worked_example)
- [ ] Flashcard type
- [ ] Exercise + SolutionStep types
- [ ] MathTopic type (area/unit/order/prereqs/flashcards/exercises)
- [ ] Curriculum tree types (area/unit)
- [ ] Port content-loader (phase→area)
- [ ] curriculum.json skeleton (7 areas)
- [ ] Sample topic type-checks; tsc passes

## Success Criteria
- `tsc -b` passes; loader resolves curriculum with zero `file`s (all topics "coming soon").
- A sample `MathTopic` covering every section type + a flashcard + an exercise type-checks.

## Risk Assessment
- Over-modeling `graph.fnConfig` → keep to function-plot subset actually used (YAGNI); widen later.
- Curriculum churn as authoring reveals better ordering → curriculum.json is data, cheap to edit.

## Security Considerations
- Types only; enforce KaTeX-safe strings by convention (rendered with `trust:false` in P3).

## Next Steps
- P3 consumes these types in renderers/topic page. P4 consumes Flashcard/Exercise. P6 authors JSON against them.
