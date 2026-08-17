# Brainstorm Summary — Math Learning Hub

Date: 2026-08-17
Status: Agreed, ready for /plan

## 1. Problem statement

Build a self-contained web app to **re-learn foundational math for CS**, mirroring the
existing `cs-learning-hub` pattern. Two goals from user:
1. Know **what** to study (math foundations for CS).
2. Lesson / exercise / answer **format that maximizes retention** ("nhớ nhanh nhất").

User context: IT background, wants to review CS from scratch for **interview prep** + deep
understanding of software. Uses **both mobile and desktop**. Wants **intuition-first, NOT
proof-heavy** (e.g. limits via graphs + tables, not epsilon-delta). Explicitly wants a
**high-school-style "lots of exercises"** experience.

## 2. Reference pattern (cs-learning-hub)

- Stack: React + Vite + TS + Tailwind + Zustand(persist) + react-router + framer-motion +
  mermaid (diagrams) + shiki (code highlight). No backend; progress in localStorage.
- Content = **one JSON per topic**, indexed by `curriculum.json` (phase -> week -> topic).
- Topic schema: `sections[]` (intro/analogy/explanation/diagram/code_example/callout/
  key_takeaways) + `visualizer` + `quiz[]` (MCQ).
- Progress: read flag, quizScore, attempts (localStorage).

## 3. Decisions (agreed)

- **Scope**: math-hub is **fully self-contained** — all 7 areas re-authored here, NOT
  cross-linked to cs-hub. Written from a **math angle** (intuition-first, no heavy proofs).
- **MVP scope**: **full from day one** — content + MCQ quiz + spaced-repetition flashcards
  + interactive function graphs.
- **Stack**: reuse cs-hub stack + add **KaTeX** (`react-katex`) for formulas +
  **function-plot** (D3-based, lightweight) for interactive graphs. SR engine = plain code,
  no extra lib. Keep mobile+desktop responsive.

## 4. Curriculum — what to learn (7 areas)

Ordered to serve CS; each maps to a concrete CS/interview use:

1. **Đại số & Hàm số** — powers, roots, **logarithm**, linear/quadratic/exp/log functions,
   reading graphs. -> foundation; log <-> complexity.
2. **Giải tích nhẹ (Calculus-lite)** — **limits**, derivatives (rate of change), basic
   integrals. -> Big-O asymptotics, gradient descent (ML).
3. **Đại số tuyến tính (Linear algebra)** — vectors, **matrices & multiplication**,
   determinant, inverse, linear systems. -> graphics, ML, PageRank, embeddings.
4. **Toán rời rạc (Discrete math)** ⭐ — propositional logic, sets/relations/functions,
   induction (light), combinatorics/counting, recurrences. -> heart of CS.
5. **Xác suất & Thống kê** — basic probability, random variables, expectation/variance,
   Bayes. -> hashing, randomized algorithms, ML, A/B testing.
6. **Đồ thị (Graph theory)** — vertices/edges, representations, traversal, trees. ->
   networks, DB, graph algorithms.
7. **Toán cho Thuật toán** 🔑 — **Big-O/asymptotics**, modular arithmetic, GCD/primes,
   recurrences & Master theorem. -> direct bridge to DSA interviews.

## 5. Retention model — the learning loop

Per topic: **LEARN -> RECALL -> PRACTICE -> SPACE**
(content -> flashcards -> exercises -> SM-2 spaced review).

Backed by: retrieval practice / testing effect, spaced repetition, interleaving,
worked-example effect, dual coding, desirable difficulties.

### Key insight on "high-school style exercises" (user question)
- Doing many exercises by hand = retrieval practice = genuinely strong for retention.
  **Keep it.**
- BUT high-school habit = **massed practice** (many same-type in one sitting) -> fluency
  illusion -> fast forgetting.
- Fix: system schedules **spaced + interleaved** practice (mix topics, revisit old
  problems via SM-2 right before forgetting). Still allow a "focused single-chapter drill"
  mode for first-time learning, but don't stop there.
- Net: user keeps the satisfying "lots of exercises" feel + gains anti-forgetting the
  high-school approach lacked.

## 6. Lesson format (extend cs-hub schema)

Keep existing sections; add 3 math-specific section types:
- `formula` — KaTeX block + "đọc là..." plain-language reading + what each symbol means.
- `graph` — interactive function plot (drag parameters, watch curve change). Dual coding.
- `worked_example` — problem + numbered step-by-step + result. Worked-example effect.

Recommended order per lesson: intro (hook + why) -> analogy -> formula/explanation ->
graph (visual) -> worked_example (2-3) -> callout (common mistakes) -> key_takeaways
(cheat sheet).

## 7. Exercise format (3 tiers + progressive disclosure)

```jsonc
exercise: {
  id, difficulty: "warmup" | "apply" | "challenge",
  prompt,
  hints: [...],          // revealed one at a time (active recall before answer)
  solutionSteps: [...],  // see answer format
  answer,
  commonMistake,
  relatedFlashcard      // link into SR deck
}
```
- Tiers: warmup (recall definition) -> apply (use it) -> challenge (combine, CS-flavored).
- Progressive hints: user must attempt before full solution unlocks.
- Interleaving review mode mixes exercises across topics.

## 8. Answer format (most important for memory)

Never just the final result. Each solution:
- Numbered steps, **each step states the rule/theorem used**.
- **⚠️ marker at the exact step people usually get wrong** (inline common-mistake warning).
- Ends with: ✅ final answer, 🔗 link to CS relevance, 🃏 link to related flashcard.
Rationale: each solution simultaneously teaches the method, warns the pitfall, and wires
the fact into the existing knowledge graph -> fastest durable recall.

## 9. Spaced repetition engine (flashcards)

- Each topic ships a flashcard deck (definition / formula / concept cards).
- **SM-2** algorithm: per-card `easeFactor`, `interval`, `dueDate`; user self-grades
  Again/Hard/Good/Easy -> schedule stretches.
- Persist in localStorage via zustand persist. No backend. Works mobile + desktop.
- "Ôn hôm nay" (Review Today) page gathers all due cards, mixed across topics
  (interleaving).

## 10. Proposed content JSON schema (per math topic)

```
MathTopic {
  id, title, area (1-7), unit, order, icon, tagline, readTime, prerequisites[]
  sections: [ ...existing types + formula | graph | worked_example ]
  flashcards: [ { id, front, back, type: 'concept'|'formula'|'definition' } ]
  exercises: [ { id, difficulty, prompt, hints[], solutionSteps[], answer,
                 commonMistake, relatedFlashcard } ]
  quiz: [ MCQ ... ]
}
```

## 11. Risks / notes

- **Content authoring is the real cost** — 7 areas x many topics of JSON. Prioritize
  areas 1,2,3 first (foundation) then 4-7.
- KaTeX + function-plot are low-risk additions; keep interactive graphs only where they
  add value (YAGNI) — static/mermaid otherwise.
- SM-2 in localStorage = no cross-device sync (acceptable for single user; note if sync
  ever needed later).
- Keep files < 200 lines per user rules; SR engine as its own module.

## 12. Success criteria

- User can pick a topic, learn, self-test (quiz), drill exercises with step-by-step
  answers, and get spaced flashcard reminders across sessions.
- Formulas render cleanly; at least a few interactive graphs in area 1-2.
- Progress + SR state persist across mobile and desktop sessions.

## 13. Next step

Run `/plan` with this summary as context to produce phased implementation plan
(scaffold + schema + SR engine first, then content authoring by area).
