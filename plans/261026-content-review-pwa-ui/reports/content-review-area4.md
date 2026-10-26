# Content review — Area 4 (Discrete Math)

Scope: `src/content/area4/{propositional-logic,sets-relations-functions,induction,combinatorics,recurrences}.json`.
All numbers were recomputed or brute-forced in python3. `node scripts/validate-content.mjs area4` passes. All existing flashcard/exercise/quiz ids are kept.

## (a) Errors found and fixed

### sets-relations-functions
- **q-set-3 had the wrong answer.** It asked about `f: N -> N, f(n) = n mod 5` and marked "surjective, not injective" as correct. With codomain N the map is NOT surjective (7 is never hit), so the right answer was "neither". Changed the codomain to {0,..,4}, kept the answer and explained in the text that surjectivity depends on the codomain.
- Relation table: the example for **transitive** was "cha-ông-cháu". "Là cha của" is not transitive. Changed it to "tổ tiên (ancestor)" / `<`, with a note on why. Added an antisymmetric row.
- The function table said "injective = hash function tốt (ít collision)". Injective means NO collision, which is impossible when |keys| > |buckets| (pigeonhole). Rewrote it, plus fc-set-function and the commonMistake of ex-set-challenge-1.
- Intro and analogy used `\\` (rendered as a literal "\\") for set difference. Replaced it with ∖. The claim "LEFT JOIN = hiệu" is now "LEFT JOIN + `IS NULL` anti-join ≈ hiệu".

### combinatorics
- **q-comb-2 had two correct options.** Both C(6,2)=15 and C(6,4)=15 were listed. Replaced the extra option with 2^6=64.
- **ex-comb-challenge-1 had N and M swapped.** It said "h: {0..N-1} -> {0..M-1}, N=365, M=23" but solved it as 23 users into 365 buckets. Rewrote the prompt. The "253 independent pairs" reasoning is now labelled as an approximation (pairs are not independent), and the exact 50.7% product formula is added.
- **Birthday bound was wrong in 4 places** (explanation, takeaway, flashcard, exercise answer). They claimed "~√N items gives >50% collision". The real threshold is ≈ 1.18·√N; at exactly √N the chance is ≈ 39% (√365 ≈ 19 gives 37.9%). Fixed all four. "~√365≈19 items" is now ≈ 22.5, i.e. 23.
- ex-comb-warmup-1 commonMistake said "10×4 — nhầm quy tắc nhân với phép cộng". That mislabels it, because 10×4 is multiplication. Rewrote the explanation.
- Graph caption said "2^n grows much faster than n²". On the plotted domain 2^x < x² for 2 < x < 4. The caption now says they meet at 2 and 4. TSP row now says (n−1)!/2 tours. 26^8 is now ≈ 2.1×10^11 (was 2×10^11).

### recurrences
- **The Fibonacci code had no base case.** Both `fib_slow` and `fib_dp` would recurse forever. Rewrote them with `n if n < 2 else ...`, plus a bottom-up O(1)-space version.
- The callout said `n/log n` is "Case 2 mở rộng (không phải Case 1)". This is misleading. It is in the gap of the basic Master Theorem; the extended version gives Θ(n log log n). Rewrote the callout and added the Case-3 regularity condition.
- ex-rec-challenge-1 called `2T(n/2)+n` "QuickSort (trung bình)". That recurrence is the balanced-pivot case. Relabelled it and added the worst case T(n−1)+n = Θ(n²).
- The analogy was titled "lãi kép" (compound interest), which is unrelated to divide & conquer. Rewrote it as delegating work down a team. The recursion tree now says "≈ log₂n levels (log₂n + 1 including leaves)".

### induction
- **Known issue fixed.** The loop-invariant prose had `i*(i+1)/2 ... total = i*...` with stray asterisks (rendered as italic). It is now in math. The ex-ind-challenge-1 hints had the same problem (`b * power(...)`) and are now in code/math.
- **The factorial diagram did not match the code.** The code's base case is n==0, but the diagram ended at factorial(1) "base case". Added factorial(0) as the base case.
- ex-ind-warmup-1 asked to "check base case AND inductive step" but only solved the base case. Added the inductive step.
- ex-ind-challenge-1 commonMistake ("1^anything=1") was confusing. It also pointed to the loop-invariant flashcard; it now points to a new fc-ind-recursion.
- "2^n > n explains why O(n) is better than O(2^n)" was a non-sequitur. It now says 2^n/n → ∞.
- "Kỹ thuật mạnh mẽ nhất" was overstated. Also noted that the base case can be any n₀.

### propositional-logic
- Worked example 1: the step flagged as a common mistake was not a mistake. It now flags the real slip: dropping the parentheses, so `a && b || c` = (a∧b)∨c lets a logged-out user through. Added the 3-of-8 count and short-circuit.
- The De Morgan code section said the deny and allow conditions are "tương đương". They are negations of each other. Fixed, added comparison negation (`>` becomes `<=`) and the SQL NULL caveat.
- fc-pl-tautology used "luật loại trừ trung gian"; the Vietnamese term is "luật bài trung". ex-pl-apply-1 rule "đổi OR thành OR" was garbled. ex-pl-warmup-1 common-mistake flag moved to the real slip (reading ¬p∧q as ¬(p∧q)).

### All files
- Every ``` code fence was removed. The renderer does not support them and they collapsed into one line. They are now inline `code` one-liners.
- Unquoted mermaid labels containing ":" in the combinatorics diagram are now quoted.
- Added a `rule` to every exercise solution step that was missing one. Each exercise now has exactly one isCommonMistake step.

## (b) Additions per topic (each topic now has ≥8 flashcards, 6 exercises (2/2/2), 6 quiz; `correct` indices spread over 0–3)
- **propositional-logic** (fc 10, quiz [0,3,2,1,0,3]):
  - p⇒q ≡ ¬p∨q and vacuous truth
  - short-circuit evaluation section
  - converse/inverse/contrapositive table
  - quantifier negation formula
  - all/any/every/some, `all([])`, quantifier order
  - worked example negating a spec
  - exercises: contrapositive, nested-quantifier negation, boolean simplification to `a||b`
- **sets-relations-functions** (fc 10, quiz [2,0,3,1,3,0]):
  - power set 2^n, |A×B|, |B|^|A|, 2-set inclusion–exclusion
  - bitmask subset worked example
  - equivalence relations → Union-Find; partial orders → topological sort (+ DAG diagram)
  - pigeonhole for hashing; domain/codomain
  - exercises: subset counting, equivalence + union-find, 5 keys into 8 buckets (6720/32768 → 79.5% collision)
- **induction** (fc 9, quiz [2,0,1,3,2,1]):
  - loop invariant as initialization/maintenance/termination, with the binary-search invariant
  - strong-induction worked example (4k/5k notes, n ≥ 12, why 4 base cases)
  - structural induction (binary tree has n+1 null pointers); "all horses same color" fallacy
  - exercises: sum of odds = n², geometric sum 2^n − 1 = max n-bit uint, strong induction for binary representation
- **combinatorics** (fc 10, quiz [2,3,0,1,2,0]):
  - 2×2 table of order × repetition, including multisets
  - stars and bars, with a worked example (66 / 36)
  - Pascal's identity as DP
  - Unique Paths grid C(8,2)=28
  - 3-set inclusion–exclusion (74)
  - pigeonhole (hash, compression, find-duplicate, ⌈N/k⌉)
  - multinomial flashcard (MISSISSIPPI 34650)
  - exercises: bit strings C(8,3)=56, inclusion–exclusion 74/26, constrained stars and bars C(11,3)=165
- **recurrences** (fc 10, quiz [1,3,0,2,3,1]):
  - Master table extended (Karatsuba, Case-3 example), with a note on when Master doesn't apply
  - Hanoi unrolling (2^n − 1)
  - characteristic-equation formula (distinct and repeated roots)
  - Binet worked example
  - memoization vs tabulation, call count 2F(n+1)−1, DP cost = states × transition
  - exercises: T(n−1)+n = Θ(n²), Climbing Stairs (89), a_n = 5a_{n−1} − 6a_{n−2} → 2·3^n − 2^n

## (c) Suggestions not implemented
- All five topics share `icon: "logic"`. Distinct icons (set, domino, tree...) would need renderer icon-map changes, which the lead owns.
- The combinatorics graph could plot n! using the gamma function, but function-plot's interval evaluator may not support it, so I left it out.
- The recurrences Master table has 4 columns with formulas; it is fine on mobile but scrolls horizontally on very narrow screens.
- Possible future topics: generating functions, derangements/Catalan numbers (BST count, valid parentheses), and the Akra–Bazzi method. I left them out to keep the scope tight.
