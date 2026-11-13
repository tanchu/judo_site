import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { GLOSSARY } from '@/content/glossary';

const total = GLOSSARY.reduce((sum, s) => sum + s.entries.length, 0);

export const metadata: Metadata = {
  title: 'Глоссарий дзюдо',
  description: `${total} японских терминов дзюдо с переводом: этикет, тренировка, разделы техники, части названий, команды судьи.`,
};

export default function GlossaryPage() {
  return (
    <>
      <PageHeader
        title="Глоссарий"
        subtitle={`${total} японских терминов, которые звучат на тренировке и экзамене.`}
      />
      <nav aria-label="Разделы глоссария" className="print:hidden">
        <ul className="flex flex-wrap gap-2">
          {GLOSSARY.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="
                  inline-block rounded-full border border-border bg-surface px-3
                  py-1 text-sm
                  hover:border-primary
                "
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {GLOSSARY.map((s) => (
        <div key={s.id} id={s.id} className="scroll-mt-4">
          <Section title={s.title}>
            <dl
              className="
                divide-y divide-border rounded-lg border border-border
                bg-surface
              "
            >
              {s.entries.map((e) => (
                <div
                  key={e.term}
                  className="
                    grid gap-1 p-3
                    sm:grid-cols-[12rem_1fr] sm:gap-4
                    print:break-inside-avoid
                  "
                >
                  <dt lang="ja-Latn" className="font-semibold text-primary">{e.term}</dt>
                  <dd>{e.ru}</dd>
                </div>
              ))}
            </dl>
          </Section>
        </div>
      ))}
      <p className="mt-8 text-sm text-text-muted">
        {'Названия конкретных техник — в разделе '}
        <Link href="/techniques/" className="text-primary underline">«Все техники»</Link>
        {'. Порядок экзамена — на странице '}
        <Link href="/etiquette/" className="text-primary underline">«Этикет экзамена»</Link>
        .
      </p>
    </>
  );
}
