import type { Grade } from '@/lib/spaced-repetition-sm2';

// Shared SM-2 self-grade row for flashcards and exercises.
const GRADES: { grade: Grade; label: string; tone: string }[] = [
  { grade: 'again', label: 'Chưa nhớ', tone: 'text-accent-purple' },
  { grade: 'hard', label: 'Khó', tone: 'text-accent-orange' },
  { grade: 'good', label: 'Nhớ', tone: 'text-accent-blue' },
  { grade: 'easy', label: 'Dễ', tone: 'text-accent-green' },
];

export function SelfGradeButtons({ onGrade, prompt }: { onGrade: (g: Grade) => void; prompt?: string }) {
  return (
    <div>
      {prompt && <p className="mb-2 text-xs text-text-muted">{prompt}</p>}
      <div className="grid grid-cols-4 gap-1.5">
        {GRADES.map(({ grade, label, tone }) => (
          <button
            key={grade}
            onClick={() => onGrade(grade)}
            className={`rounded-btn bg-bg-panel py-2.5 text-sm font-medium transition-colors hover:bg-bg-primary active:scale-[0.98] ${tone}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
