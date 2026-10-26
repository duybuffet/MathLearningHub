import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/types/content-schema-types';
import { useTopicProgress } from '@/hooks/use-topic-progress';
import { flatTopicList } from '@/lib/content-loader';
import { QuizQuestionCard } from './quiz-question-card';
import { QuizResultSummary } from './quiz-result-summary';

interface QuizSectionProps {
  topicId: string;
  quiz: QuizQuestion[];
}

type QuizState = 'idle' | 'answering' | 'done';

function buildNextTopicHref(topicId: string): string | undefined {
  const all = flatTopicList();
  // topicId format: "area1_logarithms" — match areaId_slug
  const currentIdx = all.findIndex(
    (t) => `${t.areaId}_${t.slug}` === topicId,
  );
  if (currentIdx === -1) return undefined;

  for (let i = currentIdx + 1; i < all.length; i++) {
    const next = all[i];
    if (next.file) {
      return `/area/${next.areaId}/${next.slug}`;
    }
  }
  return undefined;
}

export function QuizSection({ topicId, quiz }: QuizSectionProps) {
  const [state, setState] = useState<QuizState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const { progress, setQuizScore } = useTopicProgress(topicId);

  if (!quiz || quiz.length === 0) return null;

  const total = quiz.length;

  function handleStart() {
    setCurrentIndex(0);
    setCorrectCount(0);
    setFinalScore(0);
    setState('answering');
  }

  function handleAnswered(correct: boolean) {
    const newCorrect = correctCount + (correct ? 1 : 0);

    if (currentIndex + 1 >= total) {
      const pct = Math.round((newCorrect / total) * 100);
      setCorrectCount(newCorrect);
      setFinalScore(pct);
      setQuizScore(pct);
      setState('done');
    } else {
      setCorrectCount(newCorrect);
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setCorrectCount(0);
    setFinalScore(0);
    setState('answering');
  }

  const nextTopicHref = buildNextTopicHref(topicId);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-serif text-2xl text-text-primary">Kiểm tra nhanh</h2>

      {state === 'idle' && (
        <div className="flex flex-col items-start gap-4 rounded-card bg-bg-card px-5 py-5">
          <p className="text-text-secondary">
            {total} câu trắc nghiệm về bài này.
            {progress.quizScore !== undefined && (
              <span className="text-text-muted"> Điểm cao nhất của bạn: {progress.quizScore}%.</span>
            )}
          </p>
          <button
            onClick={handleStart}
            className="rounded-btn bg-accent-orange px-5 py-2.5 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90"
          >
            {progress.quizScore !== undefined ? 'Làm lại' : 'Bắt đầu'}
          </button>
        </div>
      )}

      {state === 'answering' && (
        <>
          <div className="h-1 w-full overflow-hidden rounded-full bg-bg-card">
            <div
              className="h-1 rounded-full bg-accent-orange transition-all duration-300"
              style={{ width: `${(currentIndex / total) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <QuizQuestionCard
              key={quiz[currentIndex].id}
              question={quiz[currentIndex]}
              questionNumber={currentIndex + 1}
              total={total}
              onAnswered={handleAnswered}
            />
          </AnimatePresence>
        </>
      )}

      {state === 'done' && (
        <QuizResultSummary
          score={finalScore}
          bestScore={progress.quizScore}
          correctCount={correctCount}
          total={total}
          onRetry={handleRetry}
          nextTopicHref={nextTopicHref}
        />
      )}
    </div>
  );
}
