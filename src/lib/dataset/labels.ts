import type { Category, Group, ThrowSet } from './types';

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

/** Соглашение набора данных (`meta.conventions`). */
export const RIGHT_GRIP_NOTE = 'Описано для правостороннего захвата: правая рука на отвороте, левая на рукаве.';

/** Шаги броска по теории Кодокана. */
export const STEP_NAMES = ['Кузуси — выведение из равновесия', 'Цукури — вход', 'Какэ — завершение'] as const;

export const SET_LABELS: Record<ThrowSet, Label & { description: string }> = {
  gokyo: { name: 'Gokyo-no-waza', ru: 'Гокё — пять групп основных бросков', description: '40 основных бросков Кодокана в пяти группах.' },
  habukareta: { name: 'Habukareta-waza', ru: 'Хабукарэта — сохранённые броски', description: 'Броски, исключённые из Гокё при пересмотре 1920 года и вновь официально признанные Кодоканом в 1982 году.' },
  shinmeisho: { name: 'Shinmeisho-no-waza', ru: 'Синмэйсё — новые признанные броски', description: 'Броски, официально признанные Кодоканом в 1982 году и позже.' },
};

/** Наборы со своими страницами `/sets/[set]` (Гокё разбит на `/gokyo/[n]`). */
export const LISTED_SETS = ['habukareta', 'shinmeisho'] as const satisfies ThrowSet[];
