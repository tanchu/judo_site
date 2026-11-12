import { useSyncExternalStore } from 'react';

/** История попыток хранится только в браузере (бриф, стр. 4 — без бэкенда и регистрации). */
export type Attempt = {
  date: string;
  score: number;
  total: number;
};

const KEY = 'judo-quiz-history';
const LIMIT = 10;
const EMPTY: Attempt[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedValue: Attempt[] = EMPTY;

function read(): Attempt[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as Attempt[]) : EMPTY;
    } catch {
      cachedValue = EMPTY;
    }
  }
  return cachedValue;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

export function saveAttempt(attempt: Attempt) {
  try {
    localStorage.setItem(KEY, JSON.stringify([attempt, ...read()].slice(0, LIMIT)));
  } catch {
    // Хранилище недоступно (приватный режим) — просто не сохраняем.
  }
  listeners.forEach((listener) => listener());
}

export function useHistory(): Attempt[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
