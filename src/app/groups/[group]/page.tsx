import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { TechniqueList } from '@/components/technique/technique-list';
import { getTechniquesByGroup, isGroup } from '@/lib/dataset';
import { ALL_GROUPS, GROUP_LABELS } from '@/lib/dataset/labels';

type Props = { params: Promise<{ group: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_GROUPS.map((group) => ({ group }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { group } = await params;
  if (!isGroup(group)) {
    return {};
  }
  const label = GROUP_LABELS[group];
  return { title: `${label.name} — ${label.ru}`, description: `Техники группы ${label.name}: ${label.ru.toLowerCase()}.` };
}

export default async function GroupPage({ params }: Props) {
  const { group } = await params;
  if (!isGroup(group)) {
    notFound();
  }
  const label = GROUP_LABELS[group];
  return (
    <>
      <PageHeader title={label.name} subtitle={label.ru} />
      <TechniqueList techniques={getTechniquesByGroup(group)} />
    </>
  );
}
