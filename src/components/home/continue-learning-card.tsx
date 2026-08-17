// "Continue Learning" card — shows last visited topic from progress store.
import { Link } from 'react-router-dom';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { getCurriculum } from '@/lib/content-loader';
import { topicIdFor } from '@/lib/content-loader';

export function ContinueLearningCard() {
  const lastVisited = useProgressStore((s) => s.lastVisited);
  const curriculum = getCurriculum();

  if (!lastVisited) return null;

  // Find the topic from the curriculum by topicId (format: areaId_slug)
  const [areaId, ...slugParts] = lastVisited.split('_');
  const slug = slugParts.join('_');
  const area = curriculum.areas.find((a) => a.id === areaId);
  if (!area) return null;

  let foundTopic: { title: string } | null = null;
  for (const unit of area.units) {
    const t = unit.topics.find((tp) => topicIdFor(areaId, tp.slug) === lastVisited);
    if (t) { foundTopic = t; break; }
  }
  if (!foundTopic) return null;

  return (
    <Link
      to={`/area/${areaId}/${slug}`}
      className="block rounded-card border border-border-subtle bg-bg-card p-5 hover:bg-bg-panel hover:border-accent-blue/40 transition-colors no-underline group"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-blue/10 text-lg flex-shrink-0" aria-hidden="true">
          📖
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted mb-0.5">Tiếp tục học (Continue)</p>
          <p className="font-semibold text-text-primary truncate">{foundTopic.title}</p>
          <p className="text-xs text-text-muted mt-0.5">{area.title}</p>
        </div>
        <span className="text-accent-blue group-hover:translate-x-1 transition-transform duration-150 flex-shrink-0">→</span>
      </div>
    </Link>
  );
}
