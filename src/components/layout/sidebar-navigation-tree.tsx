import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { getCurriculum, topicIdFor } from '@/lib/content-loader';
import { overallCompletion, areaReadStats } from '@/lib/completion-progress-helpers';
import { splitBilingualTitle } from '@/lib/topic-title-and-numbering';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { CurriculumArea } from '@/types/content-schema-types';

/** One chapter (area) in the sidebar: number + title, expandable lesson list. */
function ChapterSection({ area, number, defaultOpen }: { area: CurriculumArea; number: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  // Navigating into this chapter (e.g. via "next lesson") expands it.
  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);
  const progress = useProgressStore((s) => s.progress);
  const { read, total } = areaReadStats(getCurriculum(), progress, area.id);
  const lessons = area.units.flatMap((u) => u.topics);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-baseline gap-3 rounded-btn px-3 py-2 text-left transition-colors hover:bg-bg-panel"
        aria-expanded={open}
      >
        <span className="w-4 shrink-0 font-serif text-sm text-accent-orange">{number}</span>
        <span className="flex-1 text-sm font-medium leading-snug text-text-primary">{area.title}</span>
        <span className="shrink-0 text-xs tabular-nums text-text-muted">
          {read}/{total}
        </span>
      </button>

      {open && (
        <ul className="mb-2 ml-[1.375rem] border-l border-border-subtle">
          {lessons.map((topic, i) => {
            const isRead = progress[topicIdFor(area.id, topic.slug)]?.read ?? false;
            const { vi } = splitBilingualTitle(topic.title);
            if (!topic.file) return null;
            return (
              <li key={topic.slug}>
                <NavLink
                  to={`/area/${area.id}/${topic.slug}`}
                  className={({ isActive }) =>
                    [
                      '-ml-px flex items-baseline gap-2 border-l py-1.5 pl-4 pr-3 text-[0.8125rem] leading-snug transition-colors',
                      isActive
                        ? 'border-accent-orange text-text-primary'
                        : 'border-transparent text-text-secondary hover:text-text-primary',
                    ].join(' ')
                  }
                >
                  <span className="w-6 shrink-0 tabular-nums text-text-muted">
                    {number}.{i + 1}
                  </span>
                  <span className="flex-1">{vi}</span>
                  {isRead && (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" aria-label="Đã đọc" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SidebarNavigationTree() {
  const curriculum = getCurriculum();
  const progress = useProgressStore((s) => s.progress);
  const { pct, read, total } = overallCompletion(curriculum, progress);
  // Sidebar lives in the layout route, so read the area from the URL directly.
  const areaId = useLocation().pathname.match(/^\/(?:area|drill)\/([^/]+)/)?.[1];

  return (
    <nav className="flex h-full flex-col">
      <div className="px-5 pb-4 pt-[calc(1.25rem+env(safe-area-inset-top))]">
        <Link to="/" className="font-serif text-lg text-text-primary transition-colors hover:text-accent-orange">
          <span className="mr-1.5 text-accent-orange">∑</span>Math Hub
        </Link>
      </div>
      <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {curriculum.areas.map((area, i) => (
          <ChapterSection
            key={area.id}
            area={area}
            number={i + 1}
            defaultOpen={areaId ? area.id === areaId : i === 0}
          />
        ))}
      </div>
      <div className="border-t border-border-subtle px-5 py-4 pb-[calc(1rem+var(--safe-bottom))]">
        <p className="mb-2 text-xs text-text-muted">
          Đã đọc {read}/{total} bài
        </p>
        <ProgressBar value={pct} />
      </div>
    </nav>
  );
}
