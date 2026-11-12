import { getTranslations } from 'next-intl/server';

export async function SkipLink() {
  const t = await getTranslations('nav');
  return (
    <a
      href="#main"
      className="
        sr-only
        focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
        focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-white
      "
    >
      {t('skip')}
    </a>
  );
}
