import type { ProgressExport } from './types';

type Versioned = { updatedAt: string };

/** Слияние двух наборов записей: по ключу побеждает более поздний `updatedAt`. */
export function mergeByUpdatedAt<T extends Versioned>(
  current: readonly T[],
  incoming: readonly T[],
  key: (item: T) => string,
): T[] {
  const result = new Map(current.map((item) => [key(item), item]));
  for (const item of incoming) {
    const existing = result.get(key(item));
    if (!existing || item.updatedAt > existing.updatedAt) {
      result.set(key(item), item);
    }
  }
  return [...result.values()];
}

/** Проверка формы импортируемого файла — снаружи может прийти что угодно. */
export function isProgressExport(value: unknown): value is ProgressExport {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const data = value as Partial<ProgressExport>;
  return (
    data.format === 'judo-progress'
    && data.version === 1
    && Array.isArray(data.statuses)
    && Array.isArray(data.customItems)
    && Array.isArray(data.attempts)
  );
}

const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

/** id в формате PocketBase: 15 символов [a-z0-9]. */
export function newId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  return Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join('');
}
