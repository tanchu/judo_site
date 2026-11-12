import Link from 'next/link';
import type { TechniqueEntry } from '@/lib/dataset/types';

type Props = {
  techniques: TechniqueEntry[];
};

export function TechniqueList({ techniques }: Props) {
  return (
    <ul
      className="
        grid gap-3
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {techniques.map((t) => (
        <li key={t.slug}>
          <Link
            href={`/techniques/${t.slug}/`}
            className="
              block h-full rounded-lg border border-border bg-surface p-4
              transition
              hover:border-primary hover:shadow-sm
            "
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-semibold text-primary">{t.name}</span>
              {t.kanji && (
                <span lang="ja" className="text-sm text-text-muted">{t.kanji}</span>
              )}
            </span>
            <span className="block text-sm text-text-muted">{t.translation.ru}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
