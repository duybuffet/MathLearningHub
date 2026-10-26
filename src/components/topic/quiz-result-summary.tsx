import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface QuizResultSummaryProps {
  score: number;
  bestScore?: number;
  correctCount: number;
  total: number;
  onRetry: () => void;
  nextTopicHref?: string;
}

export function QuizResultSummary({
  score,
  bestScore,
  correctCount,
  total,
  onRetry,
  nextTopicHref,
}: QuizResultSummaryProps) {
  const isPerfect = score === 100;
  const isPassing = score >= 70;

  const scoreColor = isPerfect
    ? 'text-accent-green'
    : isPassing
      ? 'text-accent-blue'
      : 'text-accent-orange';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-start gap-4 rounded-card bg-bg-card px-5 py-5"
    >
      <p className="text-text-primary">
        <span className={`mr-3 font-serif text-4xl tabular-nums ${scoreColor}`}>{score}%</span>
        <span className="text-text-secondary">
          {correctCount}/{total} câu đúng
        </span>
      </p>

      <p className="text-text-secondary">
        {isPerfect
          ? 'Đúng hết. Bài này bạn đã nắm chắc.'
          : isPassing
            ? 'Khá vững. Xem lại giải thích của các câu sai rồi làm lại.'
            : 'Chưa chắc. Đọc lại phần lý thuyết và ví dụ, rồi làm lại.'}
        {bestScore !== undefined && <span className="text-text-muted"> Điểm cao nhất: {bestScore}%.</span>}
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onRetry}
          className="rounded-btn bg-bg-panel px-4 py-2.5 text-sm text-text-primary transition-colors hover:bg-bg-primary"
        >
          Làm lại
        </button>
        {nextTopicHref && (
          <Link
            to={nextTopicHref}
            className="rounded-btn bg-accent-orange px-4 py-2.5 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90"
          >
            Sang bài tiếp theo
          </Link>
        )}
      </div>
    </motion.div>
  );
}
