import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { GOKYO_NUMBERS, getAllTechniques } from '@/lib/dataset';
import { ALL_GROUPS } from '@/lib/dataset/labels';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/techniques/',
    '/quiz/',
    '/about/',
    ...GOKYO_NUMBERS.map((n) => `/gokyo/${n}/`),
    ...ALL_GROUPS.map((g) => `/groups/${g}/`),
    ...getAllTechniques().map((t) => `/techniques/${t.slug}/`),
  ];
  return paths.map((path) => ({ url: new URL(path, SITE_URL).toString() }));
}
