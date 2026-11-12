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
            <span className="block font-semibold text-primary">{t.name}</span>
            <span className="block text-sm text-text-muted">{t.translation.ru}</span>
            {t.steps && (
              <span
                className="
                  mt-2 inline-block rounded-sm bg-success-soft px-2 py-0.5
                  text-xs text-success
                "
              >
                Есть описание
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
