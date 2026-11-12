'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import type { ChecklistStatus } from './types';
import { getProgressRepository } from './index';

/** `undefined` — пока данные грузятся (и при статической сборке). */
export function useStatuses(): Map<string, ChecklistStatus> | undefined {
  return useLiveQuery(async () => {
    const records = await getProgressRepository().getStatuses();
    return new Map(records.map((r) => [r.techniqueSlug, r.status]));
  }, []);
}

export function useCustomItems() {
  return useLiveQuery(() => getProgressRepository().getCustomItems(), []);
}

export function useAttempts() {
  useEffect(() => {
    void getProgressRepository().init();
  }, []);
  return useLiveQuery(() => getProgressRepository().getAttempts(), []);
}
