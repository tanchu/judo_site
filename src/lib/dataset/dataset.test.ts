import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  GOKYO_NUMBERS,
  getAllTechniques,
  getGokyoTechniques,
  getOfficialTechniques,
  getTechnique,
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
