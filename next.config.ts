import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isDev = process.env.NODE_ENV === 'development';

/**
 * Сайт полностью статический (бриф, стр. 4): `next build` кладёт готовый HTML в `out/`,
 * который отдаёт Cloudflare Pages / Netlify. Бэкенда и БД нет — данные лежат в `data/`.
 */
const nextConfig: NextConfig = {
  output: 'export',
  // Хостинги статики отдают `/techniques/o-soto-gari/index.html` по адресу со слешем.
  trailingSlash: true,
  images: { unoptimized: true },
  // data-testid нужен только e2e-тестам, которые гоняются против dev-сервера.
  compiler: isDev ? undefined : {
    reactRemoveProperties: { properties: ['^data-testid$'] },
  },
};

export default withNextIntl(nextConfig);
