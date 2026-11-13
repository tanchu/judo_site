'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import { getProgressRepository } from '@/lib/progress';
import { CHECKLIST_STATUSES, type ChecklistStatus } from '@/lib/progress/types';

type Props = {
  slug: string;
  name: string;
  status: ChecklistStatus | undefined;
  /** Подпись группы видна (карточка техники) или только для скринридера (строка списка). */
  showLegend?: boolean;
};

const ACTIVE: Record<ChecklistStatus, string> = {
  none: 'bg-border/60 font-semibold',
  learning: 'bg-warning text-white',
  confident: 'bg-success text-white',
};

/** Самооценка по технике: не начинал / учу / уверенно. */
export function StatusPicker({ slug, name, status, showLegend = false }: Props) {
  const t = useTranslations('progress');
  const current = status ?? 'none';
  return (
    <fieldset className="print:hidden">
      <legend className={cn(showLegend ? 'mb-2 font-semibold' : 'sr-only')}>
        {t('statusLegend', { name })}
      </legend>
      <div
        className="
          inline-flex overflow-hidden rounded-lg border border-border bg-surface
        "
      >
        {CHECKLIST_STATUSES.map((value) => (
          <label
            key={value}
            className={cn(
              `
                cursor-pointer px-3 py-1.5 text-sm
                has-focus-visible:outline-2 has-focus-visible:outline-primary
              `,
              current === value ? ACTIVE[value] : 'hover:bg-border/40',
            )}
          >
            <input
              type="radio"
              name={`status-${slug}`}
              value={value}
              checked={current === value}
              onChange={() => void getProgressRepository().setStatus(slug, value)}
              className="sr-only"
            />
            {t(`status.${value}`)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
