# Content review — Area 7 (Math for Algorithms)

Scope: `src/content/area7/{big-o-asymptotics, recurrences-master-theorem, modular-arithmetic, gcd-primes}.json` + new `number-bases-binary.json`.
Validation: `node scripts/validate-content.mjs area7` → all content valid. All numbers re-computed with python3.

Final counts (sec / fc / ex / quiz):
- big-o-asymptotics: 14 / 9 / 6 / 7, correct=[0123102]
- recurrences-master-theorem: 14 / 10 / 6 / 7, correct=[1230231]
- number-bases-binary (NEW): 16 / 11 / 6 / 8, correct=[20312302]
- modular-arithmetic: 12 / 9 / 6 / 7, correct=[2103023]
- gcd-primes: 15 / 10 / 6 / 7, correct=[0312310]

Order renumbered: big-o 1, recurrences 2, number-bases 3, modular 4 (was 3), gcd 5 (was 4). Modular now has `prerequisites: ["area7_number-bases-binary"]`.
All existing flashcard/exercise/quiz ids kept.

## (a) Errors found and fixed

### modular-arithmetic
1. **Wrong worked-example result**: "2¹⁰⁰ mod 13 = 9" → it is **3**. The step said "(9 × 3 × 3) mod 13" but 2⁶⁴ ≡ 3, 2³² ≡ 9, 2⁴ ≡ 3, so 3·9·3 = 81 ≡ 3. Checked with Fermat (2¹² ≡ 1, 100 = 8·12 + 4 → 2⁴ ≡ 3) and with `pow(2,100,13)`.
2. **Wrong a·b mod n example**: it claimed 10¹⁵ mod (10⁹+7) = 999993000001 (larger than the modulus, which is impossible) and that the product of the residues "still overflows int64". Correct value: 10¹⁵ mod M = **993000007**. The product of two residues is < M² ≈ 10¹⁸ and **fits** int64, which is the whole point of the technique. Final answer 999657007.
3. **Wrong division-pitfall example**: "4·3 ≡ 10·3 (mod 6) but 4 ≢ 10 (mod 6)" is false, because 10 ≡ 4 (mod 6). Replaced with 2·3 ≡ 4·3 (mod 6) but 2 ≢ 4.
4. **Wrong clock analogy**: "2 hours before 9 am = 11 pm yesterday (10 = 22 − 12)" → 11 hours before 9 am is **10 pm**.
5. **Wrong hash value**: 1000007 % 7 = 6 → it is **1**.
6. Hash-size explanation was muddled (multiples of 4 with size 4). It now uses size 8, where multiples of 4 only reach slots 0 and 4, and explains it with gcd.
7. ex-mod-warmup-1: the "commonMistake" said something correct ("computing 343 mod 5 also works"). Replaced with a real mistake: reducing the exponent mod m.
8. ex-mod-challenge-1 `relatedFlashcard` pointed to the hash-table card. It now points to the new `fc-mod-prime-modulus`. Added the int32-sum reason.
9. q-mod-3 was ambiguous (two options were effectively correct). Rewritten around a real overflow case (`a % M * b % M` still overflows).

### recurrences-master-theorem
10. **q-rec-3 had two valid answers**: "T(n)=2T(n/2)+n log n" is *also* not solvable by the basic Master Theorem (it falls in the gap). Replaced that option with 3T(n/4)+n (Case 3).
11. ex-rec-apply-1 (3T(n/3)+n): the hint said this was **ternary search**. That is wrong: ternary search is T(n/3)+1 = Θ(log n). The answer listed "quick sort, merge sort". Now it names 3-way merge sort, and the ternary-search confusion became the commonMistake.
12. The Case-3 statement had **no regularity condition**. Added it to the formula, the procedure, a worked example and a flashcard.
13. Callout item "f(n) = n^p with an extra log factor — extended case 2" was imprecise. It now says 2T(n/2)+n log n → Θ(n log² n) and 2T(n/2)+n/log n → Θ(n log log n), and that both need a recursion tree.
14. "Quick sort average: T(n)=2T(n/2)+n" now says this is the balanced split. The average case is also Θ(n log n), but proving it needs a probabilistic argument.
15. Master-theorem formula was one very long display line with Vietnamese-free but unreadable text. Replaced with a `cases` layout that fits on mobile.

### big-o-asymptotics
16. **Intro number**: "with n = 10,000 the first runs ~3 billion steps" → 3n²+5n+10 = 300,050,010 ≈ **300 million**.
17. Bubble sort "O(n) when already sorted" is only true with the early-exit flag. Added that qualifier.
18. Linear-search step rule "don't confuse O(n/2) with O(n²)" was nonsense. Now: n/2 is still O(n).
19. q-bigo-3 distractor and explanation reworded. The crossover is at n = 1000; the old option "B faster because n² < 1000n when n is small" was misleading at n = 2000.
20. The flashcard "order from fast to slow" was ambiguous (growth vs speed). Clarified, and √n and n! added.
21. "O(2ⁿ) infeasible for n > 60" was too lenient → n ≳ 40–50 (2⁵⁰ ≈ 10¹⁵ → more than 10 days).
22. Graph used the non-palette colour #ff6b6b. Now uses the 4 chalk colours.

### gcd-primes
23. **Euclid caption**: "each step b shrinks by at least 50%" is false. Correct: a mod b < a/2, so the number halves every **two** steps. Example: 55 → 34 is only a 38% drop. There is a new challenge exercise proving this.
24. √n callout: "the small divisor d/n" → **n/d**.
25. The RSA challenge said "use extended Euclid" but solved it by guessing d=27. It now shows the real extended-Euclid steps (40 = 13·3 + 1 → d = −13 + 40 = 27) and an encrypt/decrypt check (2³ = 8, 8²⁷ mod 55 = 2).
26. ex-gcd-warmup-1 step-1 `rule` was garbled self-contradicting text. Rewritten.
27. Sieve exercise hint listed i=3 crossings as {9,15,21,27} only. The algorithm crosses 9, 12, 15, …, 27. Fixed. The commonMistake was "start from 2i", which is not a mistake (just wasteful). Replaced with a real one: forgetting i=5 (25).
28. Fraction example silently skipped the swap step of gcd(252, 360). Made explicit.
29. RSA text: TLS key exchange is mostly ECDHE today. Added a note; RSA is still used for signatures.

### All files (rendering bugs)
30. Triple-backtick code blocks (in big-o, gcd ×3, recurrences/exercise prompts) are not supported by the renderer and showed as broken text. Converted them to inline `code`/list lines. Multi-line code in exercise/worked-example prompts (InlineMarkdown only) became one-line inline code.
31. Vietnamese `\text{ sao cho }` inside the Big-O LaTeX was replaced with pure-math notation (`\exists c, n_0 : ...`). Unicode subscripts in `sym` fields (n₀) → `n_0`.

## (b) Content additions per topic

- **big-o**: worked "find c and n₀" example (2n+10, c=3, n₀=10, non-uniqueness); formal O/Ω/Θ definitions with constants and the "notation vs worst/best case" distinction; log-base irrelevance (and why it fails for exponentials); full ordering 1 < log n < √n < n < n log n < n² < 2ⁿ < n!; sequential = sum, halving loop = log; amortized analysis of dynamic-array doubling (vs +k growth → O(n²)); pitfalls (two inputs → O(a+b), string concatenation). New fc ×4, ex ×3 (c/n₀ for 3n²+5n+10 → c=4, n₀=7; doubling outer loop = O(n) not O(n log n); amortized copy count), quiz ×4.
- **recurrences**: recursion-tree intuition + mermaid tree; regularity condition; Case-3 worked example (2T(n/2)+n²); subtract-form example T(n−1)+n = Θ(n²) and Hanoi 2ⁿ−1; Karatsuba/Strassen vs naive 8T(n/2)+n² = Θ(n³); expanded "doesn't apply" list (uneven split, log gap, non-constant a). New fc ×5, ex ×3 (T(n/2)+n = Θ(n); 8T vs 7T; 2T(n/2)+n log n = Θ(n log² n) via tree), quiz ×4.
- **number-bases-binary (new)**: positional notation (bases 2/8/10/16), dec↔bin↔hex (repeated division, 4-bit grouping, byte = 2 hex digits, colour/chmod examples), conversion diagram, 2ᵏ values and ⌈log₂(n+1)⌉ bits (+ step-function graph), two's complement (weights, range, why −x = ~x+1, overflow Java vs C UB, binary-search mid overflow), bitwise ops and set/clear/toggle/check bit, the classic tricks (parity, shifts, x&(x−1), popcount, x&−x, XOR single number, XOR swap caveat), bitmask subset enumeration worked example, IEEE-754 / 0.1+0.2 / money / 2⁵³, pitfalls (precedence `x & 1 == 0`, shift width, JS 32-bit). 11 fc, 6 ex, 8 quiz.
- **modular**: `%` with negatives across languages (table: C/Java/JS −1 vs Python 2) and safe idioms; `(a−b+m)%m`; polynomial rolling hash (Java hashCode "abc" = 96354); fast-exponentiation algorithm in O(log e); modular inverse + Fermat's little theorem (a^(p−2)); nCr mod p division pitfall. New fc ×5, ex ×3 (Java vs Python −17 % 5; 3²⁰⁰ mod 7 = 2 two ways; C(5,2) mod 7 via inverse), quiz ×4.
- **gcd-primes**: why Euclid is correct and fast (Lamé / Fibonacci worst case); extended Euclid / Bézout with a worked example (240, 46 → 47·46 − 9·240 = 2); fundamental theorem of arithmetic, divisor count, gcd/lcm by min/max exponents; trial-division factorisation worked example (360); sieve correctness (why i², why stop at √n) and the n log log n intuition; π(10⁶) = 78,498 vs n/ln n; Miller–Rabin mention. New fc ×5, ex ×3 (gcd/lcm by factorisation; 7⁻¹ mod 26 = 15; Euclid O(log) proof + gcd(89,55) 9 steps), quiz ×4.

## (c) Suggestions not implemented

- Modular `prerequisites` now point to number-bases; gcd still lists modular. If the UI gates on prerequisites, the lead may want to review.
- The renderer has no multi-line code block. A fenced-code block type would help algorithm topics (sieve, fast pow, gcd); for now those are list lines.
- Possible future topics: Chinese Remainder Theorem / Euler's φ in general; Miller–Rabin in detail; Akra–Bazzi; bit-DP (TSP over subsets).
- Number formatting is mixed: most of the site uses English separators (10,000; 2.66), and some area texts use Vietnamese (10.000; 2,66). Area 7 now uses English style consistently. A site-wide convention would help.
