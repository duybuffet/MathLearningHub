// ── Content schema — math topic contract ─────────────────────
// Consumed by content loader, topic page, renderers, quiz, flashcards, exercises.
// Extends the cs-learning-hub schema with math-specific section types +
// flashcards + exercises for the retention loop.

export type SectionType =
  | 'intro'
  | 'analogy'
  | 'explanation'
  | 'diagram'
  | 'callout'
  | 'key_takeaways'
  | 'formula' // KaTeX block + plain-language reading
  | 'graph' // interactive function-plot
  | 'worked_example'; // step-by-step solved problem

export type CalloutVariant = 'tip' | 'warning' | 'info';

/** One symbol → meaning row shown under a formula. */
export interface FormulaSymbol {
  sym: string; // e.g. "n" or "\\log"
  meaning: string; // plain-language explanation
}

/** A single plotted function for the `graph` section (function-plot config). */
export interface GraphFunction {
  fn: string; // function-plot expression, e.g. "log(x) / log(2)"
  color?: string;
  /** 'polyline' (default) | 'scatter' etc. — passed to function-plot. */
  graphType?: string;
}

/** One numbered step inside a worked example. */
export interface WorkedStep {
  text: string; // the step (markdown-lite)
  rule?: string; // the rule/theorem this step applies
  isCommonMistake?: boolean; // ⚠️ highlight — where learners usually slip
}

export interface ContentSection {
  type: SectionType;
  /** heading for analogy/explanation/worked_example blocks */
  title?: string;
  /** prose body (markdown-lite: paragraphs separated by \n\n) */
  content?: string;
  /** callout styling */
  variant?: CalloutVariant;
  /** key_takeaways bullet list */
  items?: string[];
  /** diagram: Mermaid source */
  mermaid?: string;
  /** caption shown beneath a diagram / graph */
  caption?: string;

  // ── formula ──
  latex?: string; // KaTeX source (display mode)
  reading?: string; // "đọc là ..." plain-language reading
  symbols?: FormulaSymbol[];

  // ── graph ──
  functions?: GraphFunction[];
  xDomain?: [number, number];
  yDomain?: [number, number];

  // ── worked_example ──
  problem?: string; // the prompt
  steps?: WorkedStep[]; // numbered solution steps
  result?: string; // final result line
}

// ── Quiz (MCQ, same shape as cs-hub) ──────────────────────────
export type QuizQuestionType = 'mcq';

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuizQuestionType;
  options: string[];
  correct: number; // index into options
  explanation: string;
}

// ── Flashcards (spaced repetition source) ─────────────────────
export type FlashcardType = 'concept' | 'formula' | 'definition';

export interface Flashcard {
  id: string;
  front: string; // prompt (may contain $latex$)
  back: string; // answer (may contain $latex$)
  type: FlashcardType;
}

// ── Exercises (tiered practice) ───────────────────────────────
export type ExerciseDifficulty = 'warmup' | 'apply' | 'challenge';

export interface SolutionStep {
  text: string; // the step (markdown-lite, may contain $latex$)
  rule?: string; // rule/theorem used in this step
  isCommonMistake?: boolean; // ⚠️ marks the step people usually get wrong
}

export interface Exercise {
  id: string;
  difficulty: ExerciseDifficulty;
  prompt: string;
  hints: string[]; // revealed one at a time
  solutionSteps: SolutionStep[];
  answer: string;
  commonMistake?: string;
  relatedFlashcard?: string; // Flashcard.id
}

// ── Topic ─────────────────────────────────────────────────────
export interface MathTopic {
  id: string; // "area1_logarithms"
  title: string;
  area: number; // 1-7
  unit: string; // unit id within the area
  order: number;
  icon: string; // key into topic-card-icon SVG map
  tagline: string;
  readTime: string; // e.g. "~15 min"
  prerequisites?: string[]; // topic ids
  sections: ContentSection[];
  flashcards: Flashcard[];
  exercises: Exercise[];
  quiz: QuizQuestion[];
}

// Back-compat alias — some modules refer to a generic "TopicContent".
export type TopicContent = MathTopic;

// ── Curriculum tree (area → unit → topic) ─────────────────────
export interface CurriculumTopic {
  slug: string;
  title: string;
  /** path relative to src/content, e.g. "area1/logarithms.json"; omitted if not authored yet. */
  file?: string;
}

export interface CurriculumUnit {
  id: string;
  title: string;
  topics: CurriculumTopic[];
}

export interface CurriculumArea {
  id: string; // "area1"
  title: string; // Vietnamese
  titleEn?: string; // English term (bilingual chrome)
  icon: string;
  units: CurriculumUnit[];
}

export interface Curriculum {
  areas: CurriculumArea[];
}

// ── Progress (localStorage) ───────────────────────────────────
export interface TopicProgress {
  read: boolean;
  readAt?: string; // ISO date
  quizScore?: number; // best 0-100
  quizAttempts: number;
  lastVisited?: string; // ISO date
}
