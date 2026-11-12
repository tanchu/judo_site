import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SkipLink } from '@/components/layout/skip-link';
import { SITE_URL } from '@/config/site';
import { LOCALE } from '@/i18n/request';
import '@/app/globals.css';

const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-noto-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta');
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('siteName'), template: `%s | ${t('siteName')}` },
    description: t('description'),
    openGraph: { type: 'website', siteName: t('siteName') },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={LOCALE} className={notoSans.variable}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <SkipLink />
          <Header />
          <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
