import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/types/content-schema-types';
import { InlineMarkdown } from './inline-markdown';
import { ProseBlocks } from './markdown-table';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  total: number;
  onAnswered: (correct: boolean) => void;
}

export function QuizQuestionCard({
  question,
  questionNumber,
  total,
  onAnswered,
}: QuizQuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
  }

  function getOptionStyle(idx: number): string {
    const base =
      'flex w-full gap-3 rounded-btn border px-4 py-3 text-left text-[0.9375rem] leading-relaxed transition-colors duration-150 ';
    if (!answered) {
      return base + 'border-transparent bg-bg-panel text-text-primary hover:border-accent-blue/50 cursor-pointer';
    }
    if (idx === question.correct) {
      return base + 'border-accent-green/70 bg-accent-green/10 text-text-primary cursor-default';
    }
    if (idx === selected) {
      return base + 'border-accent-purple/70 bg-accent-purple/10 text-text-primary cursor-default';
    }
    return base + 'border-transparent bg-bg-panel text-text-muted cursor-default opacity-60';
  }

  function getOptionLabel(idx: number): string {
    if (!answered) return '';
    if (idx === question.correct) return 'Đúng';
    if (idx === selected) return 'Sai';
    return '';
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col gap-4"
    >
      <p className="text-xs tabular-nums text-text-muted">
        Câu {questionNumber}/{total}
      </p>

      <div className="font-serif text-lg text-text-primary">
        <ProseBlocks content={question.question} className="leading-relaxed" />
      </div>

      <div className="flex flex-col gap-2">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={getOptionStyle(idx)}
            onClick={() => handleSelect(idx)}
            disabled={answered}
          >
            <span className="w-4 shrink-0 text-sm text-text-muted">{String.fromCharCode(65 + idx)}</span>
            <span className="min-w-0 flex-1">
              <InlineMarkdown text={opt} />
            </span>
            {getOptionLabel(idx) && (
              <span className={`shrink-0 text-xs ${idx === question.correct ? 'text-accent-green' : 'text-accent-purple'}`}>
                {getOptionLabel(idx)}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-2 border-accent-blue pl-4 text-[0.9375rem] leading-relaxed text-text-secondary"
          >
            <span className="mb-0.5 block text-xs font-medium text-accent-blue">Giải thích</span>
            <ProseBlocks content={question.explanation} className="leading-relaxed" />
          </motion.div>
        )}
      </AnimatePresence>

      {answered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <button
            onClick={() => onAnswered(selected === question.correct)}
            className="rounded-btn bg-accent-orange px-5 py-2.5 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90"
          >
            {questionNumber === total ? 'Xem kết quả' : 'Câu tiếp theo'}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
