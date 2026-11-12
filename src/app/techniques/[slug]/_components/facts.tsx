import Link from 'next/link';
import type { ReactNode } from 'react';
import type { TechniqueEntry } from '@/lib/dataset/types';
import { CATEGORY_LABELS, GROUP_LABELS, SET_LABELS } from '@/lib/dataset/labels';

type Props = {
  technique: TechniqueEntry;
};

const SOURCE_LABELS = {
  official: 'Официальный список Кодокана',
  fundamental: 'Основы',
  supplementary: 'Вне официального списка',
} as const;

export function Facts({ technique: t }: Props) {
  const rows: { term: string; value: ReactNode }[] = [
    { term: 'Раздел', value: `${CATEGORY_LABELS[t.category].name} — ${CATEGORY_LABELS[t.category].ru.toLowerCase()}` },
  ];
  if (t.group) {
    rows.push({
      term: 'Группа',
      value: (
        <Link href={`/groups/${t.group}/`} className="text-primary underline">
          {GROUP_LABELS[t.group].name}
          {' — '}
          {GROUP_LABELS[t.group].ru.toLowerCase()}
        </Link>
      ),
    });
  }
  if (t.gokyo) {
    rows.push({
      term: 'Гокё',
      value: (
        <Link href={`/gokyo/${t.gokyo}/`} className="text-primary underline">
          {`${t.gokyo}-я группа`}
        </Link>
      ),
    });
  }
  if (t.set && t.set !== 'gokyo') {
    rows.push({
      term: 'Набор',
      value: (
        <Link href={`/sets/${t.set}/`} className="text-primary underline">
          {SET_LABELS[t.set].name}
        </Link>
      ),
    });
  }
  if (t.aliases?.length) {
    rows.push({ term: 'Другие написания', value: t.aliases.join(', ') });
  }
  rows.push({ term: 'Источник', value: SOURCE_LABELS[t.source] });

  return (
    <dl
      className="
        grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-lg border
        border-border bg-surface p-4
      "
    >
      {rows.map((row) => (
        <div key={row.term} className="contents">
          <dt className="text-text-muted">{row.term}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
