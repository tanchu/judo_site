import { CATEGORY_LABELS, GROUP_LABELS, KATAME_GROUPS, NAGE_GROUPS } from '@/lib/dataset/labels';
import type { TechniqueEntry } from '@/lib/dataset/types';

/**
 * Движок тестов, этап 1 (бриф — стр. 5, п. 4): вопросы генерируются из базы техник.
 * Вручную написанная теория (история, правила, этикет) добавится отдельным банком вопросов.
 */
export const QUIZ_TOPICS = ['translation', 'group', 'gokyo'] as const;
export type QuizTopic = (typeof QUIZ_TOPICS)[number];

export const QUIZ_SIZES = [10, 20, 30, 50] as const;

export type Question = {
  id: string;
  topic: QuizTopic;
  text: string;
  options: string[];
  answer: number;
  explanation: string;
  techniqueSlug: string;
};

type Random = () => number;

function shuffle<T>(items: readonly T[], random: Random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickDistractors<T>(pool: readonly T[], correct: T, count: number, random: Random): T[] {
  return shuffle(pool.filter((item) => item !== correct), random).slice(0, count);
}

function build(
  topic: QuizTopic,
  t: TechniqueEntry,
  text: string,
  correct: string,
  distractors: string[],
  explanation: string,
  random: Random,
): Question {
  const options = shuffle([correct, ...distractors], random);
  return {
    id: `${topic}:${t.slug}`,
    topic,
    text,
    options,
    answer: options.indexOf(correct),
    explanation,
    techniqueSlug: t.slug,
  };
}

function translationQuestion(t: TechniqueEntry, pool: TechniqueEntry[], random: Random): Question {
  const others = pool.filter((o) => o.slug !== t.slug);
  const explanation = `${t.name} — «${t.translation.ru}».`;
  if (random() < 0.5) {
    const distractors = pickDistractors(others, t, 3, random).map((o) => o.translation.ru);
    return build('translation', t, `Как переводится ${t.name}?`, t.translation.ru, distractors, explanation, random);
  }
  const distractors = pickDistractors(others, t, 3, random).map((o) => o.name);
  return build('translation', t, `Какая техника называется «${t.translation.ru}»?`, t.name, distractors, explanation, random);
}

function groupQuestion(t: TechniqueEntry, random: Random): Question | undefined {
  if (!t.group) {
    return undefined;
  }
  const groups = t.category === 'nage-waza' ? NAGE_GROUPS : KATAME_GROUPS;
  const label = (g: (typeof groups)[number]) => `${GROUP_LABELS[g].name} (${GROUP_LABELS[g].ru.toLowerCase()})`;
  const distractors = pickDistractors(groups, t.group, 3, random).map(label);
  const category = CATEGORY_LABELS[t.category].name;
  return build(
    'group',
    t,
    `К какой группе ${category} относится ${t.name}?`,
    label(t.group),
    distractors,
    `${t.name} («${t.translation.ru}») входит в группу ${label(t.group)}.`,
    random,
  );
}

function gokyoQuestion(t: TechniqueEntry, random: Random): Question | undefined {
  if (!t.gokyo) {
    return undefined;
  }
  const label = (n: number) => `${n}-я группа (дай-${['ик', 'ни', 'сан', 'ён', 'го'][n - 1]}кё)`;
  const distractors = pickDistractors([1, 2, 3, 4, 5], t.gokyo, 3, random).map(label);
  return build(
    'gokyo',
    t,
    `В какую группу Гокё-но-вадза входит ${t.name}?`,
    label(t.gokyo),
    distractors,
    `${t.name} изучается в ${label(t.gokyo)} Гокё-но-вадза.`,
    random,
  );
}

function questionFor(topic: QuizTopic, t: TechniqueEntry, pool: TechniqueEntry[], random: Random) {
  switch (topic) {
    case 'translation':
      return translationQuestion(t, pool, random);
    case 'group':
      return groupQuestion(t, random);
    case 'gokyo':
      return gokyoQuestion(t, random);
  }
}

/**
 * Собирает тест: каждая техника встречается не больше одного раза. Если подходящих техник
 * меньше `count` (например, в Гокё их 40), тест будет короче.
 */
export function generateQuiz(
  techniques: TechniqueEntry[],
  topics: readonly QuizTopic[],
  count: number,
  random: Random = Math.random,
): Question[] {
  const questions: Question[] = [];
  for (const t of shuffle(techniques, random)) {
    if (questions.length >= count) {
      break;
    }
    const topic = topics[Math.floor(random() * topics.length)];
    const question = questionFor(topic, t, techniques, random)
      ?? topics.map((other) => questionFor(other, t, techniques, random)).find(Boolean);
    if (question) {
      questions.push(question);
    }
  }
  return questions;
}

export type TopicScore = { topic: QuizTopic; correct: number; total: number };

export function scoreByTopic(questions: Question[], answers: (number | null)[]): TopicScore[] {
  return QUIZ_TOPICS
    .map((topic) => {
      const indexes = questions.flatMap((q, i) => (q.topic === topic ? [i] : []));
      return {
        topic,
        total: indexes.length,
        correct: indexes.filter((i) => answers[i] === questions[i].answer).length,
      };
    })
    .filter((s) => s.total > 0);
}

/** Детерминированный генератор для тестов (mulberry32). */
export function seededRandom(seed: number): Random {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
