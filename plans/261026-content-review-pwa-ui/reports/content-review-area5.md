# Content Review — Area 5 (Xác suất & Thống kê)

Files: `src/content/area5/{basic-probability,random-variables,expectation-variance,bayes-theorem}.json`
Validation: `node scripts/validate-content.mjs area5` → ✓ all content valid. Formula `sym` fields were also KaTeX-checked separately, since the validator skips them.
All numbers were recomputed in python3 (exact fractions, exact birthday products, simulation for collision pairs). Existing flashcard and exercise ids are unchanged.

## (a) Factual / math errors fixed

### basic-probability
- **quiz q-prob-2 had duplicate options** ("0.12" ×2). The options are now 0.70 / 0.12 / 0.58 / "Không đủ dữ kiện", and the explanation says what each distractor is.
- **Birthday 50% threshold was wrong.** The flashcard fc-prob-birthday and quiz q-prob-3 said "√(2m) keys gives ≥50%". In fact √(2m) gives about 63%; 50% needs ≈ √(2m ln2) ≈ 1.18√m. The card also said m=365 → 23, which contradicts √730 ≈ 27. Both are now fixed. For q-prob-3 (m=50) the answer changed from "~10" to "~9", since exact values are 8 keys → 44.6% and 9 keys → 53.5%.
- **Graph caption** said "~12 keys already exceeds 50%" for m=100. The exact value at 12 keys is 49.7% (13 keys → 55.7%), so the caption now says 12–13 keys. The caption also claimed "hash tables must resize early" to avoid collisions. That is wrong: resizing is about load factor, and collisions can't be avoided. It now says collision handling is always required.
- **Worked example "no hash collision", final step rule** said "multiply independent events". The events are dependent, so the rule is now the chain rule with conditional factors.
- **Randomized quicksort text** said "P(chọn đúng pivot median) trong nửa giữa = 1/2". That is garbled and wrong. It now reads: P(pivot between the 25th and 75th percentile) = 1/2.
- **Challenge ex-prob-challenge-1:** the exact value (54.6%) was added next to the approximation (54.2%). The step rule is now "1−x ≈ e^{−x}" instead of the mislabelled "Taylor".
- **ex-prob-apply-1 commonMistake:** 1 − 3×0.02 is now correctly identified as the union-bound lower bound.

### random-variables
- **The graph was wrong.** It was titled "PMF của Binomial B(10, 0.3)" but plotted `exp(-x)` and `exp(-x/2)*0.5`, which are unrelated curves. It is replaced by an exact PMF table for B(10, 0.3) (mode 3, ~70% mass on k = 2–4) and a correctly normalised Normal PDF graph (σ=1, σ=2).
- **ex-rv-challenge-1** called the setup "linear probing" but assumed independent probes. That assumption is uniform hashing, and linear probing clusters. The wording now says uniform hashing, with a note on clustering.
- **ex-rv-apply-1:** the step flagged as a common mistake ("computing P(X=1)+… is correct but harder") was not a mistake. It is replaced with the real slip: confusing P(X≥1) with P(X=1) = 0.2916.
- **quiz q-rv-1:** the explanation referred to "đáp án A/B/C/D", which breaks once options are reordered. It now refers to options by content.
- **Intro text** said the course "focuses on discrete only". It now covers continuous variables too.

### expectation-variance
- **Quicksort worked example (n=4) had the wrong result: 4.34. The correct value is 29/6 ≈ 4.83.** The listed pair terms were wrong (three adjacent pairs give 1 each, two distance-2 pairs give 2/3, one pair gives 1/2). The result was cross-checked against 2(n+1)H_n − 4n.
- **Flashcard fc-ev-quicksort** claimed Σ 2/(j−i+1) = 2nH_n. It now says 2(n+1)H_n − 4n ≈ 2n ln n.
- **ex-ev-challenge-1 had two problems.** It defined X as "the number of good splits" but then treated it as Geometric. It also used log₂(1000) ≈ 10 recursion levels, but a good pivot only guarantees shrinkage to 3/4, so the right count is log_{4/3}(1000) ≈ 24. The exercise is rewritten as a per-element bound: E[comparisons] ≤ 2n·log_{4/3} n ≈ 48n = O(n log n), with the exact value ≈ 10986 for n=1000 noted.
- **Linearity section used a "> " blockquote,** which the renderer does not support. It is rewritten with display math, and an insertion-sort inversions example (n(n−1)/4) was added.
- **"E[comparisons] = 2n ln n"** is now written as ≈. Exact form: 2(n+1)H_n−4n ≈ 2n ln n ≈ 1.39 n log₂ n.
- **quiz q-ev-2, option D** ("only if E finite and uncorrelated") was ambiguous. It now reads "only if uncorrelated", and the explanation points out that uncorrelatedness is the condition for Var(X+Y), not for E.
- **Die example common-mistake rule** was garbled. It now names the real slip: confusing E[X²] with (E[X])². The exact result is now shown as 35/12.

### bayes-theorem
- **quiz q-bayes-1 had two correct options.** "Bằng nhau khi P(A∩B)=0" is also true (both sides are 0). It is replaced with a wrong distractor. The explanation also mislabelled confusing P(A|B) with P(B|A) as "base rate fallacy"; it now calls it confusion of the inverse / prosecutor's fallacy.
- **Mermaid diagram was broken.** It had unquoted labels with `\n`, a `|` inside a node label (breaks mermaid), and fractional people (9.9, 0.1, 49.5). It now uses 10,000 people with integer counts (99 TP, 1 FN, 495 FP, 9405 TN → 99/594 = 16.7%) and quoted labels.
- **Analogy** said "Prior × Likelihood → Posterior". It now says "Posterior ∝ Prior × Likelihood, then normalise".
- **Naive Bayes spam example:** 97.9% (truncated) is now 98.0% (0.168/0.1715 = 0.9796).
- **ex-bayes-challenge-1:** the commonMistake field held a tip (log-probabilities), not a mistake. It now describes the real mistake: forgetting to normalise.
- **ex-bayes-apply-1:** "accuracy 95%" is now "sensitivity 95%". The Vietnamese "alarm reng" is now "báo động kêu".

## (b) Content additions

| Topic | New sections | Flashcards | Exercises | Quiz |
|---|---|---|---|---|
| basic-probability | Conditional prob + multiplication rule (formula); independence vs mutually exclusive (table + correlated-failure note); sampling with/without replacement (worked example); birthday formula + 1.18√m + birthday attack/UUID; union bound tip | 5→10 | 3→6 | 3→6 |
| random-variables | Bernoulli/Poisson in overview; CDF (+ percentile link); Binomial PMF table; Poisson formula; continuous PDF + Uniform; Normal formula + graph; 68–95–99.7 callout with long-tail-latency warning; distribution-picker table | 5→9 | 3→6 | 3→6 |
| expectation-variance | Linearity rewritten (E[XY] contrast, inversions); indicator formula; fixed points of random permutation = 1 (worked example); coupon collector nH_n; Var(aX+b), Var of sum of independent + Cov; E/Var table incl. Bernoulli & Poisson; LLN/CLT with A/B-test standard-error example (4× data to halve error) | 5→10 | 3→6 | 3→6 |
| bayes-theorem | Total probability in LaTeX; odds form (prior odds × LR); precision/recall/FPR as conditional probabilities + fraud alert-fatigue example; Naive Bayes log-prob + Laplace smoothing tip | 5→9 | 3→6 | 3→6 |

New exercises:
- **basic-probability:** without-replacement sampling (15/28); the two-dice independence surprise; random load balancing → 1/e idle servers.
- **random-variables:** Uniform/Math.random point probability; Normal 68-95-99.7 CI build times; Poisson overload (λ=3, capacity 5 → 8.4% ≈ 5 min/hour).
- **expectation-variance:** Var(3X+7); expected colliding pairs C(100,2)/1000 = 4.95; coupon collector across 10 shards (29.3).
- **bayes-theorem:** precision/recall from counts (9/11); two positive tests via odds (79.8%); Monty Hall via Bayes (2/3).

Quiz `correct` indices are now spread across 0–3 in every file: 203131 / 012320 / 023120 / 230120.

## (c) Suggestions not implemented
- Markov and Chebyshev tail bounds (the expectation intro mentions "tail bound") would fit as a short callout, or as a separate topic with concentration bounds.
- Covariance and correlation get only a one-line mention. A short topic could cover them, or a "Descriptive statistics" topic (mean/median/percentiles, p50/p99).
- Hypothesis testing and confidence intervals (p-value intuition) for A/B tests deserve their own topic. The CLT section only gives the standard-error intuition.
- Reservoir sampling and Fisher–Yates correctness would be natural CS exercises for a future "randomized algorithms" topic.
- Older sections still write some formulas as plain unicode text (e.g. "P(X ≤ 1) = …") rather than `$…$`. They render fine; I only converted those I edited.
