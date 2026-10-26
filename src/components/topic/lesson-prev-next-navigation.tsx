import { Link } from 'react-router-dom';
import { adjacentLessons, lessonNumber, splitBilingualTitle } from '@/lib/topic-title-and-numbering';

/** End-of-lesson links to the previous and next lesson in curriculum order. */
export function LessonPrevNextNavigation({ areaId, slug }: { areaId: string; slug: string }) {
  const { prev, next } = adjacentLessons(areaId, slug);
  if (!prev && !next) return null;

  const cell = 'flex min-w-0 flex-col rounded-card bg-bg-card px-4 py-3 transition-colors hover:bg-bg-panel';
  return (
    <nav className="mt-12 grid gap-2 border-t border-border-subtle pt-6 sm:grid-cols-2" aria-label="Chuyển bài">
      {prev ? (
        <Link to={`/area/${prev.areaId}/${prev.slug}`} className={cell}>
          <span className="text-xs text-text-muted">Bài trước</span>
          <span className="truncate text-text-primary">
            <span className="mr-2 tabular-nums text-text-muted">{lessonNumber(prev.areaId, prev.slug)}</span>
            {splitBilingualTitle(prev.title).vi}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link to={`/area/${next.areaId}/${next.slug}`} className={`${cell} sm:text-right`}>
          <span className="text-xs text-text-muted">Bài tiếp theo</span>
          <span className="truncate text-text-primary">
            <span className="mr-2 tabular-nums text-text-muted">{lessonNumber(next.areaId, next.slug)}</span>
            {splitBilingualTitle(next.title).vi}
          </span>
        </Link>
      )}
    </nav>
  );
}
