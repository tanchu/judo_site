/**
 * Схема `data/judo-dataset.json` (v0.3, бриф — стр. 5). Основа — классификация Кодокана / IJF,
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

/** Набор бросков Кодокана: Гокё (40), Хабукарэта (8), Синмэйсё (20). */
export type ThrowSet = 'gokyo' | 'habukareta' | 'shinmeisho';

/** Откуда позиция: официальный список, основы или дополнительные элементы вне списка. */
type Source = 'official' | 'fundamental' | 'supplementary';

type Technique = {
  slug: string;
  name: string;
  aliases?: string[];
  translation: { ru: string; en: string };
  category: Category;
  group?: Group;
  kanji?: string;
  set?: ThrowSet;
  gokyo?: GokyoNumber;
  prohibited?: string;
  /** У запрещённых техник вместо шагов — только описание. */
  description?: { ru: string };
  /** Удушения и болевые: правила безопасной отработки. */
  safetyNote?: { ru: string };
  /** Ограничения правил IJF (захваты ног и т. п.). */
  competitionNote?: string;
  /** kuzushi → tsukuri → kake */
  steps?: { ru: string[] };
  commonMistake?: { ru: string };
  videoUrl?: string;
};

/** Цвета поясов кю-ступеней и чёрный пояс (дан). */
export type BeltId = 'yellow' | 'orange' | 'green' | 'blue' | 'brown' | 'black';

/** Программа поясов: на экзамен на какой пояс требуется техника. */
export type Syllabus = {
  id: string;
  name: { ru: string };
  description: { ru: string };
  belts: BeltId[];
  assignments: Record<string, BeltId>;
};

export type TechniqueEntry = Technique & { source: Source; belt: BeltId };

/** Поля карточки в списках — без шагов и текстов, чтобы не тянуть весь набор в клиентский бандл. */
export type TechniqueSummary = Pick<TechniqueEntry, 'slug' | 'name' | 'kanji' | 'translation' | 'belt'>;

export type Dataset = {
  meta: {
    version: string;
    basis: string;
    counts: {
      official: number;
      fundamentals: number;
      supplementary: number;
      withSteps: number;
    } & Record<string, unknown>;
    note: string;
    /** Шаги описаны для правостороннего захвата. */
    conventions: string;
    sources: string[];
    reviewStatus: string;
  };
  gokyoNoWaza: { group: GokyoNumber; techniques: string[] }[];
  techniques: Technique[];
  fundamentals: Technique[];
  supplementary: Technique[];
  syllabi: Syllabus[];
};
