// Collapsible area section: header with area title + completion progress bar + toggle,
// body is a responsive 1→2→3 col grid of TopicCards for all topics across the area's units.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CurriculumArea } from '@/types/content-schema-types';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { getCurriculum } from '@/lib/content-loader';
import { areaCompletionPct, areaReadStats } from '@/lib/completion-progress-helpers';
import { ProgressBar } from '@/components/ui/progress-bar';
import { TopicCardIcon } from './topic-card-icon';
import { TopicCard } from './topic-card';

interface AreaSectionCollapsibleProps {
  area: CurriculumArea;
  defaultOpen?: boolean;
}

export function AreaSectionCollapsible({ area, defaultOpen = false }: AreaSectionCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const progress = useProgressStore((s) => s.progress);
  const curriculum = getCurriculum();
  const pct = areaCompletionPct(curriculum, progress, area.id);
  const { read, total } = areaReadStats(curriculum, progress, area.id);

  const allTopics = area.units.flatMap((unit) => unit.topics);

  return (
    <section className="mb-8">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 mb-4 group focus:outline-none"
        aria-expanded={open}
      >
        <TopicCardIcon icon={area.icon} className="w-8 h-8 opacity-80 flex-shrink-0" />
        <div className="flex-1 min-w-0 text-left">
          <h2 className="text-base font-bold text-text-primary group-hover:text-accent-orange transition-colors duration-150 truncate">
            {area.title}
            {area.titleEn && (
              <span className="ml-2 text-sm font-normal text-text-muted">({area.titleEn})</span>
            )}
          </h2>
          <p className="text-xs text-text-muted mt-0.5">{read}/{total} chủ đề</p>
        </div>
        <div className="w-24 flex-shrink-0 hidden sm:block">
          <ProgressBar value={pct} />
          <p className="text-right text-xs text-text-muted mt-0.5 font-mono">{pct}%</p>
        </div>
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-text-muted group-hover:text-text-secondary transition-colors duration-150"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 6.5L9 11.5L14 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {allTopics.map((topic) => (
                <TopicCard key={topic.slug} areaId={area.id} areaIcon={area.icon} topic={topic} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
