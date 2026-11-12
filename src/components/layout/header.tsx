import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

const NAV = [
  { href: '/techniques/', key: 'techniques' },
  { href: '/quiz/', key: 'quiz' },
  { href: '/about/', key: 'about' },
] as const;

export async function Header() {
  const t = await getTranslations();
  return (
    <header
      className="
        border-b border-border bg-surface
        print:hidden
      "
    >
      <div
        className="
          mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4
          p-4
        "
      >
        <Link href="/" className="text-lg font-bold text-primary">
          <span aria-hidden="true" className="mr-2 text-accent">柔</span>
          {t('meta.siteName')}
        </Link>
        <nav aria-label={t('nav.home')}>
          <ul className="flex gap-5">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="hover:text-accent hover:underline"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
