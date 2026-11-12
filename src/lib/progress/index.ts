import { LocalRepository } from './local';
import type { ProgressRepository } from './types';

let repository: ProgressRepository | null = null;

/** Только в браузере: в статической сборке IndexedDB нет. */
export function getProgressRepository(): ProgressRepository {
  repository ??= new LocalRepository();
  return repository;
}
