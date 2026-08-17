import type { Curriculum, TopicProgress } from '@/types/content-schema-types';
import { topicIdFor } from './content-loader';

type ProgressMap = Record<string, TopicProgress>;

/** Topic ids for authored (file-present) topics in an area. */
function areaAuthoredTopicIds(curriculum: Curriculum, areaId: string): string[] {
  const area = curriculum.areas.find((a) => a.id === areaId);
  if (!area) return [];
  const ids: string[] = [];
  for (const unit of area.units) {
    for (const t of unit.topics) {
      if (t.file) ids.push(topicIdFor(areaId, t.slug));
    }
  }
  return ids;
}

/** All topic ids (authored + not) in an area — for total counts. */
function areaTotalTopicIds(curriculum: Curriculum, areaId: string): string[] {
  const area = curriculum.areas.find((a) => a.id === areaId);
  if (!area) return [];
  return area.units.flatMap((u) => u.topics.map((t) => topicIdFor(areaId, t.slug)));
}

/** Percent of an area's available (authored) topics marked read (0-100). */
export function areaCompletionPct(
  curriculum: Curriculum,
  progress: ProgressMap,
  areaId: string,
): number {
  const ids = areaAuthoredTopicIds(curriculum, areaId);
  if (ids.length === 0) return 0;
  const readCount = ids.filter((id) => progress[id]?.read).length;
  return Math.round((readCount / ids.length) * 100);
}

/** Count of topics read in an area + total authored topics (for "X/Y read" display). */
export function areaReadStats(
  curriculum: Curriculum,
  progress: ProgressMap,
  areaId: string,
): { read: number; total: number } {
  const ids = areaTotalTopicIds(curriculum, areaId);
  const read = ids.filter((id) => progress[id]?.read).length;
  return { read, total: ids.length };
}

/** Overall completion across all authored topics. */
export function overallCompletion(
  curriculum: Curriculum,
  progress: ProgressMap,
): { pct: number; read: number; total: number } {
  const all = curriculum.areas.flatMap((a) => areaAuthoredTopicIds(curriculum, a.id));
  const read = all.filter((id) => progress[id]?.read).length;
  const total = all.length;
  return { pct: total ? Math.round((read / total) * 100) : 0, read, total };
}
