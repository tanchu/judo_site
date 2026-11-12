import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { TechniqueList } from '@/components/technique/technique-list';
import { GOKYO_NUMBERS, getGokyoTechniques, isGokyoNumber } from '@/lib/dataset';

type Props = { params: Promise<{ n: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GOKYO_NUMBERS.map((n) => ({ n: String(n) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  return { title: `Гокё-но-вадза: ${n}-я группа` };
}

export default async function GokyoPage({ params }: Props) {
  const n = Number((await params).n);
  if (!isGokyoNumber(n)) {
    notFound();
  }
  return (
    <>
      <PageHeader title={`Гокё-но-вадза: ${n}-я группа`} subtitle="Восемь бросков в порядке изучения по Кодокану." />
      <TechniqueList techniques={getGokyoTechniques(n)} />
    </>
  );
}
