import { getTranslations } from 'next-intl/server';
import { datasetMeta } from '@/lib/dataset';

export async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer
      className="
        mt-16 border-t border-border py-8 text-sm text-text-muted
        print:hidden
      "
    >
      <div className="mx-auto max-w-5xl space-y-2 px-4">
        <p>{t('disclaimer')}</p>
        <p>
          Набор данных v
          {datasetMeta.version}
          {' — '}
          {datasetMeta.basis}
          .
        </p>
      </div>
    </footer>
  );
}
