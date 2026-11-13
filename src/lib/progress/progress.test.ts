import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LocalRepository } from './local';
import { isProgressExport, mergeByUpdatedAt, newId } from './merge';
import { decodeSnapshot, encodeSnapshot } from './snapshot';

let dbCounter = 0;
const freshRepo = () => new LocalRepository(`test-${++dbCounter}`);

test('id в формате PocketBase', () => {
  assert.match(newId(), /^[a-z0-9]{15}$/);
});

test('слияние: побеждает более поздний updatedAt, новые ключи добавляются', () => {
  const merged = mergeByUpdatedAt(
    [{ k: 'a', v: 1, updatedAt: '2026-01-02' }, { k: 'b', v: 1, updatedAt: '2026-01-02' }],
    [{ k: 'a', v: 2, updatedAt: '2026-01-03' }, { k: 'b', v: 2, updatedAt: '2026-01-01' }, { k: 'c', v: 2, updatedAt: '2026-01-01' }],
    (x) => x.k,
  );
  assert.deepEqual(merged.map((x) => `${x.k}${x.v}`).sort(), ['a2', 'b1', 'c2']);
});

test('статусы техник: перезапись по slug', async () => {
  const repo = freshRepo();
  await repo.setStatus('seoi-nage', 'learning');
  await repo.setStatus('seoi-nage', 'confident');
  const statuses = await repo.getStatuses();
  assert.equal(statuses.length, 1);
  assert.equal(statuses[0].status, 'confident');
});

test('свои пункты: добавить, отметить, переставить, удалить', async () => {
  const repo = freshRepo();
  const a = await repo.addCustomItem('Постирать кимоно');
  const b = await repo.addCustomItem('Подстричь ногти');
  await repo.updateCustomItem(a.id, { done: true });
  await repo.moveCustomItem(b.id, -1);
  let items = await repo.getCustomItems();
  assert.deepEqual(items.map((i) => i.text), ['Подстричь ногти', 'Постирать кимоно']);
  assert.equal(items[1].done, true);
  await repo.moveCustomItem(b.id, -1);
  await repo.deleteCustomItem(a.id);
  items = await repo.getCustomItems();
  assert.deepEqual(items.map((i) => i.text), ['Подстричь ногти']);
  const exported = await repo.exportAll();
  assert.ok(exported.customItems.find((i) => i.id === a.id)?.deletedAt, 'удаление мягкое — уйдёт в синхронизацию');
});

test('история тестов: новые сверху', async () => {
  const repo = freshRepo();
  const base = { testType: 'generated' as const, topics: [], questionCount: 10, byTopic: [] };
  await repo.saveAttempt({ ...base, score: 5, startedAt: '2026-01-01T10:00:00Z', finishedAt: '2026-01-01T10:05:00Z' });
  await repo.saveAttempt({ ...base, score: 9, startedAt: '2026-01-02T10:00:00Z', finishedAt: '2026-01-02T10:05:00Z' });
  assert.deepEqual((await repo.getAttempts()).map((a) => a.score), [9, 5]);
});

test('экспорт → импорт в другую базу и проверка формата', async () => {
  const source = freshRepo();
  await source.setStatus('o-goshi', 'learning');
  await source.addCustomItem('Выучить поклоны');
  const data = JSON.parse(JSON.stringify(await source.exportAll())) as unknown;
  assert.ok(isProgressExport(data));
  assert.equal(isProgressExport({ format: 'other' }), false);

  const target = freshRepo();
  await target.setStatus('o-goshi', 'confident');
  await target.setStatus('seoi-nage', 'confident');
  const withDates = (updatedAt: string) => ({
    ...data,
    statuses: [
      { techniqueSlug: 'o-goshi', status: 'learning' as const, updatedAt },
      { techniqueSlug: 'seoi-nage', status: 'learning' as const, updatedAt: '2000-01-01T00:00:00.000Z' },
    ],
  });
  await target.importAll(withDates('2999-01-01T00:00:00.000Z'));
  const statuses = Object.fromEntries((await target.getStatuses()).map((x) => [x.techniqueSlug, x.status]));
  assert.deepEqual(statuses, { 'o-goshi': 'learning', 'seoi-nage': 'confident' }, 'свежее побеждает в обе стороны');
  assert.equal((await target.getCustomItems()).length, 1);

  await target.clearAll();
  assert.equal((await target.getStatuses()).length, 0);
});

test('снимок чек-листа: кодирование в ссылку и обратно, мусор не ломает', () => {
  const snapshot = {
    statuses: { 'seoi-nage': 'confident', 'o-goshi': 'learning' } as const,
    items: [{ text: 'Кимоно — чистое, пояс — завязан', done: true }],
  };
  assert.deepEqual(decodeSnapshot(encodeSnapshot(snapshot)), snapshot);
  assert.equal(decodeSnapshot('!!!'), null);
  assert.equal(decodeSnapshot(''), null);
});

test('перенос старой истории из localStorage: один раз и с удалением ключа', async () => {
  const store = new Map<string, string>([['judo-quiz-history', JSON.stringify([{ date: '2026-01-05T10:00:00.000Z', score: 7, total: 10 }])]]);
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    removeItem: (k: string) => void store.delete(k),
  } as Storage;
  const repo = freshRepo();
  await repo.init();
  await repo.init();
  const attempts = await repo.getAttempts();
  assert.deepEqual(attempts.map((a) => [a.score, a.questionCount]), [[7, 10]]);
  assert.equal(store.has('judo-quiz-history'), false);
});
