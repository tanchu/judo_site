import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getOfficialTechniques } from '@/lib/dataset';
import { QUIZ_TOPICS, generateQuiz, scoreByTopic, seededRandom } from './generate';

const techniques = getOfficialTechniques();

test('тест нужного размера, техники не повторяются', () => {
  const quiz = generateQuiz(techniques, QUIZ_TOPICS, 30, seededRandom(1));
  assert.equal(quiz.length, 30);
  assert.equal(new Set(quiz.map((q) => q.techniqueSlug)).size, 30);
});

test('у каждого вопроса правильный ответ среди вариантов, варианты уникальны', () => {
  for (let seed = 0; seed < 20; seed++) {
    for (const q of generateQuiz(techniques, QUIZ_TOPICS, 50, seededRandom(seed))) {
      assert.ok(q.answer >= 0 && q.answer < q.options.length, q.id);
      assert.ok(q.options.length >= 3, q.id);
      assert.equal(new Set(q.options).size, q.options.length, q.id);
    }
  }
});

test('тема Гокё: только 40 бросков, тест обрезается', () => {
  const quiz = generateQuiz(techniques, ['gokyo'], 50, seededRandom(7));
  assert.equal(quiz.length, 40);
  assert.ok(quiz.every((q) => q.topic === 'gokyo'));
});

test('подсчёт по темам', () => {
  const quiz = generateQuiz(techniques, QUIZ_TOPICS, 10, seededRandom(3));
  const answers = quiz.map((q, i) => (i % 2 === 0 ? q.answer : null));
  const scores = scoreByTopic(quiz, answers);
  assert.equal(scores.reduce((s, x) => s + x.total, 0), 10);
  assert.equal(scores.reduce((s, x) => s + x.correct, 0), 5);
});
