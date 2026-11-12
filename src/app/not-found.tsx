import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold text-primary">{t('title')}</h1>
      <p className="mt-6">
        <Link href="/" className="text-primary underline">{t('back')}</Link>
      </p>
    </div>
  );
}
