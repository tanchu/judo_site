import {
  GOKYO_NUMBERS,
  getAllTechniques,
  getFundamentals,
  getGokyoTechniques,
  getSupplementary,
  getTechniquesBySet,
  getTechniquesByGroup,
  toSummary,
} from '@/lib/dataset';
import { BELTS, sortByBelt } from '@/lib/dataset/belts';
import { ALL_GROUPS, GROUP_LABELS, KATAME_GROUPS, SET_LABELS } from '@/lib/dataset/labels';
import type { TechniqueEntry, TechniqueSummary } from '@/lib/dataset/types';

export type CatalogSection = {
  id: string;
  title: string;
  description?: string;
  /** Страница раздела, если она есть. */
  href?: string;
  techniques: TechniqueSummary[];
};

export const CATALOG_MODES = ['groups', 'sets', 'belts'] as const;
export type CatalogMode = (typeof CATALOG_MODES)[number];

export const MODE_LABELS: Record<CatalogMode, string> = {
  groups: 'Группы Кодокана',
  sets: 'Гокё и наборы',
  belts: 'По поясам',
};

const sorted = (list: TechniqueEntry[]) => sortByBelt(list).map(toSummary);
const official = (list: TechniqueEntry[]) => list.filter((t) => t.source === 'official');

const tail = (): CatalogSection[] => [
  { id: 'fundamentals', title: 'Основы и страховки', techniques: sorted(getFundamentals()) },
  {
    id: 'supplementary',
    title: 'Дополнительно',
    description: 'Элементы вне официального списка: варианты удержаний, уходы, перевороты.',
    techniques: sorted(getSupplementary()),
  },
];

/** Классификация Кодокана: 5 групп бросков и 3 группы сковывающих приёмов. */
function byGroups(): CatalogSection[] {
  return [
    ...ALL_GROUPS.map((g) => ({
      id: g,
      title: `${GROUP_LABELS[g].name} — ${GROUP_LABELS[g].ru}`,
      href: `/groups/${g}/`,
      techniques: sorted(official(getTechniquesByGroup(g))),
    })),
    ...tail(),
  ];
}

/** Порядок изучения бросков по Кодокану (Гокё 1–5, затем Хабукарэта и Синмэйсё) и катамэ-вадза. */
function bySets(): CatalogSection[] {
  return [
    ...GOKYO_NUMBERS.map((n) => ({
      id: `gokyo-${n}`,
      title: `Гокё-но-вадза — ${n}-я группа`,
      href: `/gokyo/${n}/`,
      techniques: getGokyoTechniques(n).map(toSummary),
    })),
    { id: 'habukareta', title: SET_LABELS.habukareta.ru, href: '/sets/habukareta/', techniques: sorted(getTechniquesBySet('habukareta')) },
    { id: 'shinmeisho', title: SET_LABELS.shinmeisho.ru, href: '/sets/shinmeisho/', techniques: sorted(getTechniquesBySet('shinmeisho')) },
    ...KATAME_GROUPS.map((g) => ({
      id: g,
      title: `${GROUP_LABELS[g].name} — ${GROUP_LABELS[g].ru}`,
      href: `/groups/${g}/`,
      techniques: sorted(official(getTechniquesByGroup(g))),
    })),
    ...tail(),
  ];
}

/** Что требуется на экзамене на каждый пояс (программа по умолчанию). */
function byBelts(): CatalogSection[] {
  const all = getAllTechniques();
  return BELTS.map((b) => ({
    id: b.id,
    title: b.ru,
    techniques: all.filter((t) => t.belt === b.id).map(toSummary),
  }));
}

export function getCatalog(): Record<CatalogMode, CatalogSection[]> {
  return { groups: byGroups(), sets: bySets(), belts: byBelts() };
}
