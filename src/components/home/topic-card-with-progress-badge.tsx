// Topic card: title (bilingual), read/quiz progress badge, coming-soon state when no file.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { CurriculumTopic } from '@/types/content-schema-types';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { topicIdFor } from '@/lib/content-loader';
import { TopicCardIcon } from './topic-card-icon';
import { CompletionBadge } from '@/components/ui/completion-badge';
import { ProgressBar } from '@/components/ui/progress-bar';

interface TopicCardProps {
  areaId: string;
  areaIcon: string;
  topic: CurriculumTopic;
}

const cardBase =
  'relative flex flex-col gap-3 p-5 rounded-card border border-border-subtle bg-bg-card transition-all duration-200';

export function TopicCard({ areaId, areaIcon, topic }: TopicCardProps) {
  const progress = useProgressStore((s) => s.progress);
  const topicId = topicIdFor(areaId, topic.slug);
  const topicProgress = progress[topicId];
  const isAvailable = Boolean(topic.file);

  if (!isAvailable) {
    return (
      <div className={`${cardBase} opacity-50 cursor-not-allowed`}>
        <TopicCardIcon icon={areaIcon} className="opacity-50" />
        <div>
          <p className="text-sm font-semibold text-text-muted leading-snug">{topic.title}</p>
          <p className="text-xs text-text-muted mt-1">Đang cập nhật (Coming soon)</p>
        </div>
        <span className="absolute top-3 right-3 text-xs text-text-muted border border-border-subtle rounded px-2 py-0.5">
          Soon
        </span>
      </div>
    );
  }

  const quizScore = topicProgress?.quizScore;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group"
    >
      <Link
        to={`/area/${areaId}/${topic.slug}`}
        className={`${cardBase} group-hover:bg-bg-panel group-hover:border-accent-orange/40 group-hover:shadow-[0_0_16px_rgba(251,146,60,0.12)] no-underline block`}
      >
        <span className="absolute top-3 right-3">
          <CompletionBadge read={topicProgress?.read ?? false} score={quizScore} />
        </span>
        <TopicCardIcon icon={areaIcon} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary leading-snug pr-8">{topic.title}</p>
        </div>
        {quizScore !== undefined && <ProgressBar value={quizScore} className="mt-1" />}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-text-muted">
            {topicProgress?.read ? 'Đã đọc' : 'Chưa bắt đầu'}
          </span>
          <span className="text-xs font-mono text-accent-orange group-hover:translate-x-0.5 transition-transform duration-150">
            Mở →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
