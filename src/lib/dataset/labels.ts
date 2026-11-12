import type { Category, Group } from './types';

type Label = { name: string; ru: string };

export const GROUP_LABELS: Record<Group, Label> = {
  'te-waza': { name: 'Te-waza', ru: 'Броски руками' },
  'koshi-waza': { name: 'Koshi-waza', ru: 'Броски бедром' },
  'ashi-waza': { name: 'Ashi-waza', ru: 'Броски ногами' },
  'ma-sutemi-waza': { name: 'Ma-sutemi-waza', ru: 'Броски с падением на спину' },
  'yoko-sutemi-waza': { name: 'Yoko-sutemi-waza', ru: 'Броски с падением на бок' },
  'osaekomi-waza': { name: 'Osaekomi-waza', ru: 'Удержания' },
  'shime-waza': { name: 'Shime-waza', ru: 'Удушающие приёмы' },
  'kansetsu-waza': { name: 'Kansetsu-waza', ru: 'Болевые приёмы' },
};

export const CATEGORY_LABELS: Record<Category, Label> = {
  'nage-waza': { name: 'Nage-waza', ru: 'Броски' },
  'katame-waza': { name: 'Katame-waza', ru: 'Сковывающие приёмы' },
  ukemi: { name: 'Ukemi', ru: 'Страховки' },
  basics: { name: 'Kihon', ru: 'Основы' },
  'ne-waza-drill': { name: 'Ne-waza', ru: 'Упражнения в партере' },
};

export const NAGE_GROUPS: Group[] = ['te-waza', 'koshi-waza', 'ashi-waza', 'ma-sutemi-waza', 'yoko-sutemi-waza'];
export const KATAME_GROUPS: Group[] = ['osaekomi-waza', 'shime-waza', 'kansetsu-waza'];
export const ALL_GROUPS: Group[] = [...NAGE_GROUPS, ...KATAME_GROUPS];

/** Шаги броска по теории Кодокана. */
export const STEP_NAMES = ['Кузуси — выведение из равновесия', 'Цукури — вход', 'Какэ — завершение'] as const;
