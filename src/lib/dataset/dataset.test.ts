import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  GOKYO_NUMBERS,
  getAllTechniques,
  getGokyoTechniques,
  getOfficialTechniques,
  getTechnique,
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
