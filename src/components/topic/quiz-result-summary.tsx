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
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center gap-6 py-6 text-center"
    >
      <div className="flex flex-col items-center gap-1">
        <span className={`text-6xl font-bold font-mono ${scoreColor}`}>
          {score}%
        </span>
        <span className="text-text-secondary text-sm">
          {correctCount} / {total} đúng
        </span>
      </div>

      {bestScore !== undefined && (
        <p className="text-text-muted text-xs">
          Điểm cao nhất: <span className="text-text-secondary font-semibold">{bestScore}%</span>
        </p>
      )}

      <p className="text-text-secondary text-sm max-w-xs">
        {isPerfect
          ? 'Hoàn hảo! Xuất sắc lắm.'
          : isPassing
            ? 'Tốt lắm! Ôn thêm để nắm chắc hơn nhé.'
            : 'Hãy ôn lại topic và thử lại — bạn làm được!'}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={onRetry}
          className="flex-1 px-4 py-3 rounded-btn border border-border-subtle bg-bg-panel text-text-primary text-sm font-semibold hover:border-accent-blue transition-colors"
        >
          Thử lại
        </button>

        {nextTopicHref && (
          <Link
            to={nextTopicHref}
            className="flex-1 px-4 py-3 rounded-btn bg-accent-orange text-white text-sm font-semibold hover:opacity-90 transition-opacity text-center"
          >
            Topic tiếp →
          </Link>
        )}
      </div>
    </motion.div>
  );
}
