import Link from 'next/link';
import { cn } from '@/lib/cn';
import { getBelt } from '@/lib/dataset/belts';
import type { TechniqueSummary } from '@/lib/dataset/types';

type Props = {
  technique: TechniqueSummary;
};

/** Карточка техники в списке: рамка цвета пояса, на экзамен на который она требуется. */
export function TechniqueCard({ technique: t }: Props) {
  const belt = getBelt(t.belt);
  return (
    <Link
      href={`/techniques/${t.slug}/`}
      className={cn(
        `
          block h-full rounded-lg border-2 bg-surface p-4 transition
          hover:shadow-md
        `,
        belt.borderClass,
      )}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-semibold text-primary">{t.name}</span>
        {t.kanji && (
          <span lang="ja" className="text-sm text-text-muted">{t.kanji}</span>
        )}
      </span>
      <span className="block text-sm text-text-muted">{t.translation.ru}</span>
      <span className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
        <span aria-hidden="true" className={cn('size-2.5 rounded-full', belt.swatchClass)} />
        {belt.ru}
      </span>
    </Link>
  );
}
