import { flatTopicList, getCurriculum, type FlatTopic } from './content-loader';

/** Splits "Logarit (Logarithms)" → { vi: "Logarit", en: "Logarithms" }. */
export function splitBilingualTitle(title: string): { vi: string; en?: string } {
  const m = title.match(/^(.*\S)\s*\(([^()]+)\)\s*$/);
  return m ? { vi: m[1], en: m[2] } : { vi: title };
}

/** Chapter number (1-based) of an area, e.g. "area3" → 3. */
export function chapterNumber(areaId: string): number {
  return getCurriculum().areas.findIndex((a) => a.id === areaId) + 1;
}

/** Book-style lesson number within its chapter, e.g. "1.4". */
export function lessonNumber(areaId: string, slug: string): string {
  const area = getCurriculum().areas.find((a) => a.id === areaId);
  if (!area) return '';
  const idx = area.units.flatMap((u) => u.topics).findIndex((t) => t.slug === slug);
  return idx === -1 ? '' : `${chapterNumber(areaId)}.${idx + 1}`;
}

/** Previous / next authored lessons in curriculum order (for end-of-lesson navigation). */
export function adjacentLessons(
  areaId: string,
  slug: string,
): { prev?: FlatTopic; next?: FlatTopic } {
  const list = flatTopicList().filter((t) => t.file);
  const i = list.findIndex((t) => t.areaId === areaId && t.slug === slug);
  if (i === -1) return {};
  return { prev: list[i - 1], next: list[i + 1] };
}
