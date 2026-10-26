// Content validator — run: node scripts/validate-content.mjs [area1 area2 ...]
// Checks JSON shape, KaTeX parse of every $inline$ / latex field, unbalanced $,
// Vietnamese inside \text{}, quiz `correct` range, flashcard links, duplicate ids.
import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/content');
const filter = process.argv.slice(2);
const VI_RE = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
const SECTION_TYPES = ['intro', 'analogy', 'explanation', 'diagram', 'callout', 'key_takeaways', 'formula', 'graph', 'worked_example'];
let errors = 0;

const err = (file, where, msg) => { errors++; console.log(`✗ ${file} :: ${where} :: ${msg}`); };

function checkLatex(file, where, src, display = false) {
  // strict handler flags non-Latin glyphs (Vietnamese) in math — fonts lack them → tofu.
  let flagged = false;
  const strict = (code, msg) => { if (!flagged && /unknownSymbol|unicodeTextInMathMode/.test(code)) { flagged = true; err(file, where, `non-Latin text in math (mis-paired $ or Vietnamese in math) — in: $${src.slice(0, 80)}$`); } return 'ignore'; };
  const warn = console.warn; console.warn = () => {};
  try { katex.renderToString(src, { throwOnError: true, displayMode: display, strict }); }
  catch (e) { err(file, where, `KaTeX: ${e.message.split('\n')[0]} — in: ${src.slice(0, 80)}`); }
  finally { console.warn = warn; }
  for (const m of src.matchAll(/\\text\{([^}]*)\}/g)) if (VI_RE.test(m[1])) err(file, where, `Vietnamese inside \\text{}: ${m[1]}`);
}

function checkString(file, where, s) {
  if (typeof s !== 'string') return;
  let stripped = s.replace(/`[^`]*`/g, '');
  for (const m of stripped.matchAll(/\$\$([^$]+)\$\$/g)) checkLatex(file, where, m[1], true);
  stripped = stripped.replace(/\$\$[^$]+\$\$/g, '');
  const dollars = (stripped.match(/\$/g) || []).length;
  if (dollars % 2) err(file, where, `odd number of $ — ${s.slice(0, 80)}`);
  for (const m of stripped.matchAll(/\$([^$]+)\$/g)) checkLatex(file, where, m[1]);
}

// Fields rendered inline (one line, no lists/tables/code). Block-capable fields: section content,
// flashcard front/back, exercise prompt/answer, step text, problem, quiz question/explanation.
const INLINE_ONLY = /\.(commonMistake|rule|result|reading|caption|meaning|title|tagline)$|\.(hints|items|options)\[\d+\]$/;

function walkStrings(file, where, v) {
  if (typeof v === 'string') {
    if (INLINE_ONLY.test(where) && v.includes('\n')) err(file, where, `newline in an inline-only field (renders on one line): ${v.slice(0, 60)}`);
    checkString(file, where, v);
  }
  else if (Array.isArray(v)) v.forEach((x, i) => walkStrings(file, `${where}[${i}]`, x));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) {
    if (k === 'latex') checkLatex(file, `${where}.latex`, x, true);
    else if (k === 'sym') checkLatex(file, `${where}.sym`, x);
    else if (k === 'mermaid' || k === 'fn') continue;
    else walkStrings(file, `${where}.${k}`, x);
  }
}

const curriculum = JSON.parse(fs.readFileSync(path.join(ROOT, 'curriculum.json'), 'utf8'));
const allIds = new Set();
for (const area of curriculum.areas) for (const unit of area.units) for (const t of unit.topics) {
  if (!t.file) continue;
  allIds.add(`${area.id}_${t.slug}`);
}

for (const area of curriculum.areas) {
  if (filter.length && !filter.includes(area.id)) continue;
  for (const unit of area.units) for (const t of unit.topics) {
    if (!t.file) continue;
    const file = t.file;
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) { err(file, '-', 'file missing'); continue; }
    let d;
    try { d = JSON.parse(fs.readFileSync(full, 'utf8')); } catch (e) { err(file, '-', `invalid JSON: ${e.message}`); continue; }
    const expectId = `${area.id}_${t.slug}`;
    if (d.id !== expectId) err(file, 'id', `expected ${expectId}, got ${d.id}`);
    if (d.unit !== unit.id) err(file, 'unit', `expected ${unit.id}, got ${d.unit}`);
    for (const k of ['title', 'tagline', 'readTime', 'icon']) if (!d[k]) err(file, k, 'missing');
    for (const p of d.prerequisites ?? []) if (!allIds.has(p)) err(file, 'prerequisites', `unknown topic id ${p}`);
    (d.sections ?? []).forEach((s, i) => {
      if (!SECTION_TYPES.includes(s.type)) err(file, `sections[${i}]`, `bad type ${s.type}`);
      if (s.type === 'formula' && !s.latex) err(file, `sections[${i}]`, 'formula without latex');
      if (s.type === 'graph' && !(s.functions?.length)) err(file, `sections[${i}]`, 'graph without functions');
      if (s.type === 'worked_example' && !(s.steps?.length)) err(file, `sections[${i}]`, 'worked_example without steps');
      (s.functions ?? []).forEach((f) => { if (/[?:]|NaN/.test(f.fn)) err(file, `sections[${i}].fn`, `function-plot fn must be math.js-valid: ${f.fn}`); });
    });
    const ids = new Set();
    const dup = (id, where) => { if (ids.has(id)) err(file, where, `duplicate id ${id}`); ids.add(id); };
    const fcIds = new Set((d.flashcards ?? []).map((f) => f.id));
    (d.flashcards ?? []).forEach((f, i) => { dup(f.id, `flashcards[${i}]`); if (!f.front || !f.back) err(file, `flashcards[${i}]`, 'empty front/back'); if (!['concept', 'formula', 'definition'].includes(f.type)) err(file, `flashcards[${i}]`, `bad type ${f.type}`); });
    (d.exercises ?? []).forEach((e, i) => {
      dup(e.id, `exercises[${i}]`);
      if (!['warmup', 'apply', 'challenge'].includes(e.difficulty)) err(file, `exercises[${i}]`, `bad difficulty ${e.difficulty}`);
      if (!e.solutionSteps?.length || !e.answer || !Array.isArray(e.hints)) err(file, `exercises[${i}]`, 'missing steps/answer/hints');
      if (e.relatedFlashcard && !fcIds.has(e.relatedFlashcard)) err(file, `exercises[${i}]`, `relatedFlashcard ${e.relatedFlashcard} not found`);
    });
    (d.quiz ?? []).forEach((q, i) => {
      dup(q.id, `quiz[${i}]`);
      if (q.type !== 'mcq' || !Array.isArray(q.options) || q.options.length < 2) err(file, `quiz[${i}]`, 'bad mcq');
      else if (!(q.correct >= 0 && q.correct < q.options.length)) err(file, `quiz[${i}]`, `correct out of range`);
      if (new Set(q.options).size !== q.options.length) err(file, `quiz[${i}]`, 'duplicate options');
    });
    walkStrings(file, 'root', d);
    const dist = (d.quiz ?? []).map((q) => q.correct).join('');
    console.log(`  ${file}: sec=${d.sections.length} fc=${d.flashcards.length} ex=${d.exercises.length} quiz=${d.quiz.length} correct=[${dist}]`);
  }
}
console.log(errors ? `\n${errors} error(s)` : '\n✓ all content valid');
process.exit(errors ? 1 : 0);
