import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { ETIQUETTE } from '@/content/etiquette';

export const metadata: Metadata = {
  title: 'Этикет и порядок экзамена',
  description: 'Как подготовиться к экзамену на пояс по дзюдо: внешний вид, поклоны, поведение в зале, порядок экзамена, частые ошибки.',
};

export default function EtiquettePage() {
  return (
    <>
      <PageHeader
        title="Этикет и порядок экзамена"
        subtitle="Общие правила. Точный порядок экзамена задают ваша федерация и клуб — уточните у тренера."
      />
      {ETIQUETTE.map((block) => (
        <Section key={block.id} title={block.title}>
          <ul className="list-disc space-y-2 pl-6">
            {block.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </Section>
      ))}
      <p className="mt-10 rounded-lg bg-primary-soft p-4">
        {'Составьте свой список к экзамену в разделе '}
        <Link href="/progress/my-list/" className="text-primary underline">«Мой чек-лист»</Link>
        {', а термины повторите в '}
        <Link href="/glossary/" className="text-primary underline">глоссарии</Link>
        .
      </p>
    </>
  );
}
