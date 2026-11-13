'use client';

import Link from 'next/link';
import { StatusPicker } from '@/components/progress/status-picker';
import { useStatuses } from '@/lib/progress/hooks';

type Props = {
  slug: string;
  name: string;
};

export function MyStatus({ slug, name }: Props) {
  const statuses = useStatuses();
  return (
    <div
      className="
        mt-6 flex flex-wrap items-end justify-between gap-3
        print:hidden
      "
    >
      <StatusPicker slug={slug} name={name} status={statuses?.get(slug)} showLegend />
      <Link
        href="/progress/checklist/"
        className="text-sm text-primary underline"
      >Весь чек-лист
      </Link>
    </div>
  );
}
