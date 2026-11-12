/**
 * Схема `data/judo-dataset.json` (v0.2, бриф — стр. 5). Основа — классификация Кодокана / IJF,
 * без привязки к поясам: программы поясов по странам подключаются слоем `syllabi`.
 */
export type Category = 'nage-waza' | 'katame-waza' | 'ukemi' | 'basics' | 'ne-waza-drill';

export type Group =
  | 'te-waza'
  | 'koshi-waza'
  | 'ashi-waza'
  | 'ma-sutemi-waza'
  | 'yoko-sutemi-waza'
  | 'osaekomi-waza'
  | 'shime-waza'
  | 'kansetsu-waza';

export type GokyoNumber = 1 | 2 | 3 | 4 | 5;

/** Откуда позиция: официальный список, основы или дополнительные элементы вне списка. */
type Source = 'official' | 'fundamental' | 'supplementary';

type Technique = {
  slug: string;
  name: string;
  aliases?: string[];
  translation: { ru: string; en: string };
  category: Category;
  group?: Group;
  gokyo?: GokyoNumber;
  prohibited?: string;
  /** kuzushi → tsukuri → kake */
  steps?: { ru: string[] };
  commonMistake?: { ru: string };
  videoUrl?: string;
};

export type TechniqueEntry = Technique & { source: Source };

export type Dataset = {
  meta: {
    version: string;
    basis: string;
    counts: Record<string, number>;
    note: string;
  };
  gokyoNoWaza: { group: GokyoNumber; techniques: string[] }[];
  techniques: Technique[];
  fundamentals: Technique[];
  supplementary: Technique[];
  syllabi: unknown[];
};
