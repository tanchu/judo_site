import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { TechniqueList } from '@/components/technique/technique-list';
import { getTechniquesBySet, isListedSet } from '@/lib/dataset';
import { LISTED_SETS, SET_LABELS } from '@/lib/dataset/labels';

type Props = { params: Promise<{ set: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LISTED_SETS.map((set) => ({ set }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { set } = await params;
  if (!isListedSet(set)) {
    return {};
  }
  return { title: `${SET_LABELS[set].name} — ${SET_LABELS[set].ru}`, description: SET_LABELS[set].description };
}

export default async function SetPage({ params }: Props) {
  const { set } = await params;
  if (!isListedSet(set)) {
    notFound();
  }
  return (
    <>
      <PageHeader title={SET_LABELS[set].name} subtitle={SET_LABELS[set].description} />
      <TechniqueList techniques={getTechniquesBySet(set)} />
    </>
  );
}
