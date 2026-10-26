// Two quick entries at the top of home: resume the last lesson, and today's review.
import { Link } from 'react-router-dom';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { flatTopicList, topicIdFor } from '@/lib/content-loader';
import { lessonNumber, splitBilingualTitle } from '@/lib/topic-title-and-numbering';
import { useDueReviewCount } from '@/hooks/use-due-review-count';

const rowClass =
  'flex items-center justify-between gap-4 rounded-card bg-bg-card px-4 py-3.5 transition-colors hover:bg-bg-panel';

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-muted" aria-hidden="true">
      <path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TodayReadingShortcuts() {
  const lastVisited = useProgressStore((s) => s.lastVisited);
  const dueCount = useDueReviewCount();
  const all = flatTopicList().filter((t) => t.file);
  const resume = all.find((t) => topicIdFor(t.areaId, t.slug) === lastVisited) ?? all[0];
  const started = Boolean(lastVisited);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {resume && (
        <Link to={`/area/${resume.areaId}/${resume.slug}`} className={rowClass}>
          <span className="min-w-0">
            <span className="block text-xs text-text-muted">{started ? 'Đọc tiếp' : 'Bắt đầu từ bài đầu tiên'}</span>
            <span className="block truncate text-text-primary">
              <span className="mr-2 tabular-nums text-text-muted">{lessonNumber(resume.areaId, resume.slug)}</span>
              {splitBilingualTitle(resume.title).vi}
            </span>
          </span>
          <Chevron />
        </Link>
      )}
      <Link to="/review" className={rowClass}>
        <span className="min-w-0">
          <span className="block text-xs text-text-muted">Ôn tập hôm nay</span>
          <span className="block text-text-primary">
            {dueCount > 0 ? (
              <>
                <span className="tabular-nums text-accent-orange">{dueCount}</span> thẻ và bài tập đến hạn
              </>
            ) : (
              'Chưa có gì đến hạn'
            )}
          </span>
        </span>
        <Chevron />
      </Link>
    </div>
  );
}
