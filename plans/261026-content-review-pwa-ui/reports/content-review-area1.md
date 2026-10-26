# Content review — Area 1 (Đại số & Hàm số)

Scope: `src/content/area1/*.json` (5 existing topics + new `summations-series.json`).
Validation: `node scripts/validate-content.mjs area1` → ✓ all content valid.
All existing flashcard/exercise/quiz ids kept; new ids follow the file patterns.

## (a) Errors found & fixed

### powers-and-roots
- **q-pr-1 had two correct options**: `$8^4$` equals `(2^3)^4 = 2^12`. Replaced with `$4^3$`.
- ex-pr-challenge-1 said "**Python `int` has 64 bits**". Wrong: Python ints are arbitrary-precision. Now uses C/C++ `uint64_t`, with a note about Python.
- Worked example 1, "common mistake" step: the example `(2^2)^2 = 2^{2^2}` vs `4^2` is meaningless because all of them equal 16. Replaced with a real slip: dropping the minus sign in `2^8·2^{-3}`, which gives 2^11 and then 128.
- Analogy said O(2^n) at n=50 means "no computer can run it". 2^50 ≈ 1.1e15 steps is about 13 days at 1e9 steps/s. Now states that, and that n=60 takes about 36 years.
- Paper-folding: "reaches the Moon" now has the numbers (≈440 000 km vs ≈384 000 km).
- Intro "1 KB ≈ 2^10" conflated KB and KiB. Now uses KiB/MiB, and the SI vs IEC difference is explained.
- ex-pr-warmup-1 (a division rule) linked to the *product* flashcard. Added `fc-pr-rule-quotient` and relinked to it.
- Worked example 2: the step flagged as the mistake was just "3^2 = 9". It now names the real slip, 27^{2/3} → 27×2/3 = 18.
- Graph caption said "nhân và căn"; it should be squaring and root. It now also states the inverse relationship holds only for x ≥ 0. Colors changed to the chalk palette.

### linear-quadratic-functions
- ex-lq-challenge-1 used a ``` fenced code block, which the renderer does not support. Rewritten with inline code.
- ex-lq-challenge-1 `commonMistake` called the **correct** O(n²) conclusion a "mistake". Now the mistake is guessing O(n log n) or O(n) because the inner loop shrinks.
- Worked example 1, mistake step ("negative slope means quadratic/no root") was not a real slip. Replaced with a sign error when moving terms across (x = −3), plus a check.
- Worked example 2, mistake step ("don't simplify before sqrt") was vague. Replaced with the real `−b` sign error (−4 ± 2)/2 → −1, −3.
- Explanation used bubble sort as the small-n example. Replaced with insertion sort, the accurate example (Timsort uses it for small runs). The crossover is now given exactly as (3+√13)/2.
- The analogy "lương theo diện tích đất cần sơn" was awkward machine-translated phrasing. Rewritten.
- Long display formula split into gathered lines for mobile.

### reading-graphs
- **Concavity description was wrong**: "Lồi lên (concave up) — như bát úp ngược". An upside-down bowl is ∩, which is concave down. Rewritten as cong xuống ∩ / cong lên ∪ (convex), with the ML "convex" term clarified.
- **Log-scale claims wrong/imprecise**:
  - ex-rg-challenge-1 `commonMistake` said a straight line on log-log is "hàm mũ/power-law". It is a **power law**; a straight line on semi-log is exponential.
  - The prompt contradicted itself ("slopes almost the same" vs slopes 1 and 2).
  - The callout and `fc-rg-logscale` now distinguish semi-log from log-log.
- "slope = 0 → cực trị" in the formula symbols and the takeaways was imprecise. Now: slope 0 means horizontal; the tangent at an extremum has slope 0, but slope 0 does not imply an extremum (x³).
- ex-rg-warmup-1 `commonMistake` described something that gives the correct answer (reversing both differences). It now names the real slip: reversing only the numerator, or using Δx/Δy.
- Graph colors changed to the palette; the caption now notes x²/10 overtakes x at x = 10.

### logarithms
- ex-log-apply-1 was a near-clone of worked example 2 (log2(8×4) vs log2(4×8)). Replaced with a quotient-rule exercise, log2 48 − log2 3 = 4.
- ex-log-challenge-1: the max binary-search comparisons are now justified precisely as ⌊log2 n⌋+1 = 10. The step flagged as the mistake now explains why rounding down (9 → only 511 elements) fails.
- "Máy tính thường chỉ có ln và log" was ambiguous. A callout now covers the programming trap: `math.log`/`Math.log`/`log` is **ln**, and use `bit_length()` rather than float log2 for big ints.
- Warmup `commonMistake` wording improved (16/2 = 8 confusion).

### exponential-log-functions
- **2^50 ≈ 10^15 was called "1 ngàn tỷ" (10^12)**, in three places (fc-el-exp-growth, explanation, key takeaways). Corrected to ≈1.1×10^15 (hơn 1 triệu tỷ).
- **Worked example 2 flagged a correct identity as the mistake**: "nhầm ln(1.2^t) = t·ln 1.2". Now the mistake is (ln 1.2)^t, or t = 2/1.2. Added the rule-of-70 comparison (3.5 vs 3.8).
- **Fibonacci challenge**: "fib(50) ≈ φ^50 ≈ 2.8e10 calls" was presented as the count. The exact number of calls is 2F₅₁−1 ≈ 4.07e10; φ^50 is now framed as an order-of-magnitude estimate, and the memo count corrected to 51 values. The improvement ratio is now ≈8e8 (it was 560M).
- Worked example 1, mistake step ("x+1=5 không phải x·1=5") was nonsensical. Replaced with treating 2^{x+1} as 2(x+1).
- Callout: "O(2^n) unusable for n > 30" was wrong (n=30 is about 1 s at 1e9 steps/s). Now gives timings: n=30 ≈ 1 s, n=40 ≈ 18 min, n=50 ≈ 2 weeks.
- The half-life section was titled "Nửa thời gian" (wrong term; it should be chu kỳ bán rã) and made unsupported claims about RAM prices, Moore's law and "internet doubling every 2 years". Rewritten with the half-life formula and EMA/decay examples.
- The learning-rate claim "quá nhỏ hội tụ chậm mũ" was imprecise. Now it describes the error factor q^k accurately.
- Rule of 70: clarified that r is a decimal in ln(1+r) but a percentage in 70/R.
- Analogy title "quần thể diệt dần" did not match the content. Retitled.
- ex-el-warmup-1 `commonMistake` was not a mistake. ex-el-apply-1 had a weak mistake step, and its relatedFlashcard pointed to the inverse card; it now points to the new `fc-el-same-base`.
- Fibonacci explanation: noted that O(2^n) is a loose bound and the tight one is about 1.618^n.

### All files
- Quiz `correct` indices were almost all 1. They are now spread across 0–3 by reordering options; no explanation refers to an option position.
- Graph colors moved to the chalk palette.
- Long display formulas split with `gathered`.

## (b) Content additions
| Topic | New sections | Practice (fc / ex / quiz) |
|---|---|---|
| powers-and-roots | root rules & traps (√x²=|x|, √(a+b)), 2^10≈10^3 estimation table + KiB/overflow, binary exponentiation formula; signed int range/overflow (`lo+(hi-lo)/2`) | 5→9 / 3→6 / 3→6 |
| linear-quadratic | vertex/factored form + Vieta, ML link (linear regression, MSE parabola, mean minimizes squared error), worked ex. crossover 100n vs n² | 4→9 / 3→6 / 3→6 |
| reading-graphs | doubling test, O(n log n) recognition, truncated-axis trap, graph transformations a·f(x−h)+k, Amdahl asymptote graph | 4→8 / 3→6 / 3→6 |
| logarithms | log_b1=0, log_b b=1, negatives for x<1; bits/digits/tree height/B-tree; log(n!)≈n log n sort lower bound; `math.log` = ln callout; worked ex. bits for IDs | 4→10 / 3→6 / 3→6 |
| exponential-log | solving a^x=c with logs (inequality flip for 0<a<1), growth hierarchy, systems/ML uses (backoff, log-likelihood, sigmoid/softmax, LR decay), half-life | 4→9 / 3→6 / 3→6 |
| **summations-series (new)** | Σ notation, linearity/index shift/splitting, arithmetic (Gauss), sum of squares & Σi^k, geometric finite/infinite + convergence graph, dynamic-array amortized O(1) (vs +constant growth → O(n²)), harmonic H_n≈ln n + γ (quicksort avg, coupon collector, stride loops), loop-counting table, mermaid recognizer, pairs worked example, mistakes callout | 10 / 6 / 7 |

## (c) Suggestions not implemented
- `icon: "sigma"` for summations-series: check that the topic-card icon map has a `sigma` key (renderer is owned by the lead).
- In Vietnamese textbooks "lồi/lõm" are used in the opposite sense to the English "convex". If other areas (calculus/optimization) use these words, align them on one convention (suggested: "cong lên ∪ (convex)").
- Consider adding the "doubling test" and "loop → Σ" ideas to the Big-O topic, if another area has one, and cross-link the prerequisites.
- The renderer could support fenced code blocks; several CS-flavored exercises would read better with real multi-line code.
