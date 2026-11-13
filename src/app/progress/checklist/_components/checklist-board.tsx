'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { StatusPicker } from '@/components/progress/status-picker';
import { useStatuses } from '@/lib/progress/hooks';
import type { ChecklistScope } from '@/lib/progress/scopes';
import { CHECKLIST_STATUSES, type ChecklistStatus } from '@/lib/progress/types';
import { PrintButton } from '../../_components/print-button';
import { ScopeSummary } from './scope-summary';

type Props = {
  scopes: ChecklistScope[];
};

type Filter = 'all' | ChecklistStatus;

export function ChecklistBoard({ scopes }: Props) {
  const t = useTranslations('progress');
  const statuses = useStatuses();
  const [scopeId, setScopeId] = useState(scopes[0].id);
  const [filter, setFilter] = useState<Filter>('all');
  const scope = scopes.find((s) => s.id === scopeId) ?? scopes[0];
  const statusOf = (slug: string) => statuses?.get(slug) ?? 'none';
  const rows = scope.techniques.filter((tech) => filter === 'all' || statusOf(tech.slug) === filter);

  return (
    <div className="space-y-6">
      <ScopeSummary scopes={scopes} statuses={statuses} current={scope.id} onSelect={setScopeId} />

      <div
        className="
          flex flex-wrap items-end justify-between gap-4
          print:hidden
        "
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm text-text-muted">Показать</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className="rounded-lg border border-border bg-surface px-3 py-2"
          >
            <option value="all">Все техники</option>
            {CHECKLIST_STATUSES.map((s) => (
              <option key={s} value={s}>{t(`status.${s}`)}</option>
            ))}
          </select>
        </label>
        <PrintButton />
      </div>

      <section aria-labelledby="scope-title">
        <h2 id="scope-title" className="text-2xl font-semibold">{scope.title}</h2>
        {statuses === undefined ? (
          <p className="mt-4 text-text-muted">{t('loading')}</p>
        ) : rows.length === 0 ? (
          <p className="mt-4 text-text-muted">В этом наборе нет техник с таким статусом.</p>
        ) : (
          <ul
            className="
              mt-4 divide-y divide-border rounded-lg border border-border
              bg-surface
            "
          >
            {rows.map((tech) => (
              <li
                key={tech.slug}
                className="
                  flex flex-wrap items-center justify-between gap-3 p-3
                  print:break-inside-avoid
                "
              >
                <div>
                  <Link
                    href={`/techniques/${tech.slug}/`}
                    className="font-semibold text-primary underline"
                  >
                    {tech.name}
                  </Link>
                  <p className="text-sm text-text-muted">{tech.ru}</p>
                </div>
                <StatusPicker slug={tech.slug} name={tech.name} status={statusOf(tech.slug)} />
                <span
                  className="
                    hidden
                    print:inline
                  "
                >
                  {t(`status.${statusOf(tech.slug)}`)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
