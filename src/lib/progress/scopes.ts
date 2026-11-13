import {
  GOKYO_NUMBERS,
  getFundamentals,
  getGokyoTechniques,
  getSupplementary,
  getTechniquesBySet,
  getTechniquesByGroup,
} from '@/lib/dataset';
import { GROUP_LABELS, KATAME_GROUPS, SET_LABELS } from '@/lib/dataset/labels';
import type { TechniqueEntry } from '@/lib/dataset/types';

type ScopeTechnique = { slug: string; name: string; ru: string };
export type ChecklistScope = { id: string; title: string; techniques: ScopeTechnique[] };

const pack = (list: TechniqueEntry[]): ScopeTechnique[] =>
  list.filter((t) => !t.prohibited).map((t) => ({ slug: t.slug, name: t.name, ru: t.translation.ru }));

/**
 * Наборы для чек-листа самооценки. Запрещённые техники не входят — их учат только по названию.
 * Программы поясов по странам появятся здесь же из слоя `syllabi`.
 */
export function getChecklistScopes(): ChecklistScope[] {
  return [
    ...GOKYO_NUMBERS.map((n) => ({ id: `gokyo-${n}`, title: `Гокё, ${n}-я группа`, techniques: pack(getGokyoTechniques(n)) })),
    { id: 'habukareta', title: SET_LABELS.habukareta.name, techniques: pack(getTechniquesBySet('habukareta')) },
    { id: 'shinmeisho', title: SET_LABELS.shinmeisho.name, techniques: pack(getTechniquesBySet('shinmeisho')) },
    ...KATAME_GROUPS.map((g) => ({
      id: g,
      title: `${GROUP_LABELS[g].name} — ${GROUP_LABELS[g].ru.toLowerCase()}`,
      techniques: pack(getTechniquesByGroup(g).filter((t) => t.source === 'official')),
    })),
    { id: 'fundamentals', title: 'Основы и страховки', techniques: pack(getFundamentals()) },
    { id: 'supplementary', title: 'Дополнительно', techniques: pack(getSupplementary()) },
  ];
}
