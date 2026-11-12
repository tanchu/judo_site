import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { getChecklistScopes } from '@/lib/progress/scopes';
import { SnapshotView } from './_components/snapshot-view';

export const metadata: Metadata = {
  title: 'Чек-лист по ссылке',
  robots: { index: false },
};

export default function SnapshotPage() {
  return (
    <>
      <PageHeader title="Чек-лист по ссылке" subtitle="Снимок чужого или вашего чек-листа. Данные — только в самой ссылке." />
      <SnapshotView scopes={getChecklistScopes()} />
    </>
  );
}
