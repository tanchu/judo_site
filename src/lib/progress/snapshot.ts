import type { ChecklistStatus } from './types';

/**
 * Ссылка-«снимок» чек-листа: данные целиком в `#фрагменте` URL, на сервер не уходят.
 * Только чтение — открыть у тренера или сохранить к себе на другом устройстве.
 */
export type Snapshot = {
  statuses: Partial<Record<string, Exclude<ChecklistStatus, 'none'>>>;
  items: { text: string; done: boolean }[];
};

type Packed = { s: Record<string, 'l' | 'c'>; i: [string, 0 | 1][] };

const MAX_ITEMS = 100;
const MAX_TEXT = 300;

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const binary = atob(value.replaceAll('-', '+').replaceAll('_', '/'));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export function encodeSnapshot(snapshot: Snapshot): string {
  const packed: Packed = {
    s: Object.fromEntries(
      Object.entries(snapshot.statuses).map(([slug, status]) => [slug, status === 'confident' ? 'c' : 'l']),
    ),
    i: snapshot.items.slice(0, MAX_ITEMS).map((item) => [item.text.slice(0, MAX_TEXT), item.done ? 1 : 0]),
  };
  return toBase64Url(new TextEncoder().encode(JSON.stringify(packed)));
}

/** Строка из адресной строки — недоверенная: при любой ошибке `null`. */
export function decodeSnapshot(value: string): Snapshot | null {
  if (!value) {
    return null;
  }
  try {
    const packed = JSON.parse(new TextDecoder().decode(fromBase64Url(value))) as Partial<Packed>;
    if (typeof packed.s !== 'object' || packed.s === null || !Array.isArray(packed.i)) {
      return null;
    }
    const statuses: Snapshot['statuses'] = {};
    for (const [slug, code] of Object.entries(packed.s)) {
      if (code === 'l' || code === 'c') {
        statuses[slug] = code === 'c' ? 'confident' : 'learning';
      }
    }
    const items = packed.i
      .filter((item): item is [string, 0 | 1] => Array.isArray(item) && typeof item[0] === 'string')
      .slice(0, MAX_ITEMS)
      .map(([text, done]) => ({ text: text.slice(0, MAX_TEXT), done: done === 1 }));
    return { statuses, items };
  } catch {
    return null;
  }
}
