// Home table of contents: one chapter per curriculum area, lessons numbered like a book.
import { Link } from 'react-router-dom';
import type { CurriculumArea } from '@/types/content-schema-types';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { getCurriculum, topicIdFor } from '@/lib/content-loader';
import { areaReadStats } from '@/lib/completion-progress-helpers';
import { splitBilingualTitle } from '@/lib/topic-title-and-numbering';

interface ChapterProps {
  area: CurriculumArea;
  number: number;
}

function Chapter({ area, number }: ChapterProps) {
  const progress = useProgressStore((s) => s.progress);
  const { read, total } = areaReadStats(getCurriculum(), progress, area.id);
  let lessonIdx = 0;

  return (
    <section className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-border-subtle pb-6 pt-5 sm:grid-cols-[3.5rem_1fr]">
      <span className="font-serif text-4xl leading-none text-accent-orange sm:text-5xl" aria-hidden="true">
        {number}
      </span>
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-xl leading-tight text-text-primary">
            <span className="sr-only">Chương {number}: </span>
            {area.title}
          </h3>
          <span className="shrink-0 text-xs tabular-nums text-text-muted">
            {read}/{total}
          </span>
        </div>
        {area.titleEn && <p className="mt-0.5 text-sm text-text-muted">{area.titleEn}</p>}

        {area.units.map((unit) => (
          <div key={unit.id} className="mt-4">
            <p className="mb-1 text-xs text-text-muted">{splitBilingualTitle(unit.title).vi}</p>
            <ul>
              {unit.topics.map((topic) => {
                lessonIdx += 1;
                if (!topic.file) return null;
                const { vi, en } = splitBilingualTitle(topic.title);
                const isRead = progress[topicIdFor(area.id, topic.slug)]?.read ?? false;
                return (
                  <li key={topic.slug}>
                    <Link
                      to={`/area/${area.id}/${topic.slug}`}
                      className="group -mx-2 flex items-baseline gap-3 rounded-btn px-2 py-2 transition-colors hover:bg-bg-card"
                    >
                      <span className="w-7 shrink-0 text-sm tabular-nums text-text-muted">
                        {number}.{lessonIdx}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-[0.9375rem] text-text-primary group-hover:text-accent-orange">{vi}</span>
                        {en && <span className="ml-2 hidden text-sm text-text-muted sm:inline">{en}</span>}
                      </span>
                      <span
                        className={`h-2 w-2 shrink-0 self-center rounded-full ${isRead ? 'bg-accent-green' : 'border border-text-muted/50'}`}
                        aria-label={isRead ? 'Đã đọc' : 'Chưa đọc'}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ChapterTableOfContents() {
  const areas = getCurriculum().areas;
  return (
    <div>
      {areas.map((area, i) => (
        <Chapter key={area.id} area={area} number={i + 1} />
      ))}
    </div>
  );
}
