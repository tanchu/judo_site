import raw from '@data/judo-dataset.json';
import { ALL_GROUPS, LISTED_SETS } from './labels';
import type { Dataset, GokyoNumber, Group, Syllabus, TechniqueEntry, TechniqueSummary, ThrowSet } from './types';

const dataset = raw as Dataset;

/** Программа поясов по умолчанию. Страновые программы добавятся в `syllabi` рядом с ней. */
const syllabus: Syllabus = dataset.syllabi[0];

const withBelt = <T extends { slug: string }>(t: T) => ({ ...t, belt: syllabus.assignments[t.slug] ?? 'black' });

const entries: TechniqueEntry[] = [
  ...dataset.techniques.map((t) => withBelt({ ...t, source: 'official' as const })),
  ...dataset.fundamentals.map((t) => withBelt({ ...t, source: 'fundamental' as const })),
  ...dataset.supplementary.map((t) => withBelt({ ...t, source: 'supplementary' as const })),
];

const bySlug = new Map(entries.map((t) => [t.slug, t]));

export const datasetMeta = dataset.meta;

export function getSyllabus(): Syllabus {
  return syllabus;
}

/** Только поля для карточки в списке (для клиентских компонентов). */
export function toSummary(t: TechniqueEntry): TechniqueSummary {
  return { slug: t.slug, name: t.name, kanji: t.kanji, translation: t.translation, belt: t.belt };
}

export function getAllTechniques(): TechniqueEntry[] {
  return entries;
}

/** 100 приёмов официального списка Кодокана. */
export function getOfficialTechniques(): TechniqueEntry[] {
  return entries.filter((t) => t.source === 'official');
}

export function getTechnique(slug: string): TechniqueEntry | undefined {
  return bySlug.get(slug);
}

export function getTechniquesByGroup(group: Group): TechniqueEntry[] {
  return entries.filter((t) => t.group === group);
}

export function getFundamentals(): TechniqueEntry[] {
  return entries.filter((t) => t.source === 'fundamental');
}

export function getSupplementary(): TechniqueEntry[] {
  return entries.filter((t) => t.source === 'supplementary');
}

export const GOKYO_NUMBERS: GokyoNumber[] = [1, 2, 3, 4, 5];

export function isGokyoNumber(value: number): value is GokyoNumber {
  return (GOKYO_NUMBERS as number[]).includes(value);
}

export function isGroup(value: string): value is Group {
  return (ALL_GROUPS as string[]).includes(value);
}

/** Броски группы Гокё в порядке Кодокана. */
export function getGokyoTechniques(n: GokyoNumber): TechniqueEntry[] {
  const group = dataset.gokyoNoWaza.find((g) => g.group === n);
  return (group?.techniques ?? [])
    .map((slug) => bySlug.get(slug))
    .filter((t): t is TechniqueEntry => t !== undefined);
}

export function getTechniquesBySet(set: ThrowSet): TechniqueEntry[] {
  return entries.filter((t) => t.set === set);
}

export function isListedSet(value: string): value is (typeof LISTED_SETS)[number] {
  return (LISTED_SETS as readonly string[]).includes(value);
}
