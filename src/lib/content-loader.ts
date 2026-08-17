import type {
  Curriculum,
  CurriculumTopic,
  MathTopic,
} from '@/types/content-schema-types';
import curriculumJson from '@/content/curriculum.json';

// Eager glob of all topic JSON under content/. Keyed by path like
// "../content/area1/logarithms.json". A topic renders only when its
// curriculum entry has a `file` — enables incremental authoring (Phase 6).
const topicModules = import.meta.glob<MathTopic>('../content/**/*.json', {
  eager: true,
  import: 'default',
});

const curriculum = curriculumJson as Curriculum;

export function getCurriculum(): Curriculum {
  return curriculum;
}

/** Resolve a topic's JSON by its curriculum `file` path (e.g. "area1/logarithms.json"). */
export function loadTopicByFile(file: string): MathTopic | null {
  const match = Object.entries(topicModules).find(([key]) =>
    key.endsWith(`/${file}`),
  );
  return match ? (match[1] as MathTopic) : null;
}

/** Find a topic entry in the curriculum tree by area id + slug. */
export function findTopicEntry(
  areaId: string,
  slug: string,
): { topic: CurriculumTopic; areaIndex: number } | null {
  const areaIndex = curriculum.areas.findIndex((a) => a.id === areaId);
  if (areaIndex === -1) return null;
  for (const unit of curriculum.areas[areaIndex].units) {
    const topic = unit.topics.find((t) => t.slug === slug);
    if (topic) return { topic, areaIndex };
  }
  return null;
}

export interface FlatTopic {
  areaId: string;
  slug: string;
  title: string;
  file?: string;
}

/** Flat ordered list of every topic in the curriculum (for next/prev nav + review). */
export function flatTopicList(): FlatTopic[] {
  const out: FlatTopic[] = [];
  for (const area of curriculum.areas) {
    for (const unit of area.units) {
      for (const t of unit.topics) {
        out.push({ areaId: area.id, slug: t.slug, title: t.title, file: t.file });
      }
    }
  }
  return out;
}

/** All authored topics (curriculum entry has a file that resolves). */
export function loadAuthoredTopics(): MathTopic[] {
  return flatTopicList()
    .filter((t) => t.file)
    .map((t) => loadTopicByFile(t.file as string))
    .filter((t): t is MathTopic => t !== null);
}

/** Topic id built from area+slug, matching content JSON `id` convention. */
export function topicIdFor(areaId: string, slug: string): string {
  return `${areaId}_${slug}`;
}
