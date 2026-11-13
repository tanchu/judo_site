import assert from 'node:assert/strict';
import { test } from 'node:test';
import { beltRank, filterForBelt, sortByBelt } from './belts';
import {
  GOKYO_NUMBERS,
  getAllTechniques,
  getGokyoTechniques,
  getOfficialTechniques,
  getTechnique,
  getSyllabus,
  getTechniquesBySet,
} from './index';

test('официальный список Кодокана — 100 техник: 68 нагэ-вадза и 32 катамэ-вадза', () => {
  const official = getOfficialTechniques();
  assert.equal(official.length, 100);
  assert.equal(official.filter((t) => t.category === 'nage-waza').length, 68);
  assert.equal(official.filter((t) => t.category === 'katame-waza').length, 32);
});

test('slug-и уникальны во всём наборе', () => {
  const slugs = getAllTechniques().map((t) => t.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('каждая группа Гокё — 8 существующих бросков с тем же номером', () => {
  for (const n of GOKYO_NUMBERS) {
    const list = getGokyoTechniques(n);
    assert.equal(list.length, 8, `группа ${n}`);
    for (const t of list) {
      assert.equal(t.gokyo, n, t.slug);
      assert.equal(t.category, 'nage-waza', t.slug);
    }
  }
});

test('шаги описаны тремя пунктами: кузуси, цукури, какэ', () => {
  for (const t of getAllTechniques()) {
    if (t.steps) {
      assert.equal(t.steps.ru.length, 3, t.slug);
    }
  }
});

test('поиск по slug', () => {
  assert.equal(getTechnique('o-soto-gari')?.name, 'O-soto-gari');
  assert.equal(getTechnique('nope'), undefined);
});

test('v0.3: шаги у всех, кроме запрещённых; у запрещённых — описание', () => {
  for (const t of getAllTechniques()) {
    if (t.prohibited) {
      assert.equal(t.steps, undefined, t.slug);
      assert.ok(t.description?.ru, t.slug);
    } else {
      assert.ok(t.steps && t.commonMistake, t.slug);
    }
  }
});

test('наборы бросков: 40 Гокё, 8 Хабукарэта, 20 Синмэйсё — вместе все 68 нагэ-вадза', () => {
  assert.equal(getTechniquesBySet('gokyo').length, 40);
  assert.equal(getTechniquesBySet('habukareta').length, 8);
  assert.equal(getTechniquesBySet('shinmeisho').length, 20);
  for (const t of getOfficialTechniques().filter((x) => x.category === 'nage-waza')) {
    assert.ok(t.set, t.slug);
    assert.equal(t.set === 'gokyo', t.gokyo !== undefined, t.slug);
  }
});

test('у удушений и болевых есть правила безопасности', () => {
  for (const t of getAllTechniques()) {
    if ((t.group === 'shime-waza' || t.group === 'kansetsu-waza') && !t.prohibited) {
      assert.ok(t.safetyNote?.ru, t.slug);
    }
  }
});

test('у каждой позиции есть пояс программы по умолчанию', () => {
  const syllabus = getSyllabus();
  for (const t of getAllTechniques()) {
    assert.ok(syllabus.assignments[t.slug], t.slug);
    assert.ok(syllabus.belts.includes(t.belt), t.slug);
  }
});

test('группы Гокё распределены по поясам от жёлтого до коричневого', () => {
  const expected = ['yellow', 'orange', 'green', 'blue', 'brown'];
  for (const n of GOKYO_NUMBERS) {
    for (const t of getGokyoTechniques(n)) {
      assert.equal(t.belt, expected[n - 1], t.slug);
    }
  }
});

test('экзамен на пояс накопительный: включает техники предыдущих поясов', () => {
  const all = getAllTechniques();
  const yellow = filterForBelt(all, 'yellow', true);
  const orange = filterForBelt(all, 'orange', true);
  const orangeOnly = filterForBelt(all, 'orange', false);
  assert.ok(yellow.length > 0);
  assert.equal(orange.length, yellow.length + orangeOnly.length);
  assert.ok(orangeOnly.every((t) => t.belt === 'orange'));
});

test('sortByBelt сохраняет порядок внутри пояса', () => {
  const sorted = sortByBelt(getOfficialTechniques());
  const ranks = sorted.map((t) => beltRank(t.belt));
  assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b));
  const yellowOrder = getOfficialTechniques().filter((t) => t.belt === 'yellow').map((t) => t.slug);
  assert.deepEqual(sorted.filter((t) => t.belt === 'yellow').map((t) => t.slug), yellowOrder);
});
