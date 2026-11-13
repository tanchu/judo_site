'use client';

import { useTranslations } from 'next-intl';

export function PrintButton() {
  const t = useTranslations('progress');
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="
        rounded-lg border border-border bg-surface px-4 py-2 font-semibold
        hover:border-primary
        print:hidden
      "
    >
      {t('print')}
    </button>
  );
}
