import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { getAllTechniques, getTechnique } from '@/lib/dataset';
import { RIGHT_GRIP_NOTE } from '@/lib/dataset/labels';
import { Note } from './_components/note';
import { Facts } from './_components/facts';
import { Steps } from './_components/steps';
import { Video } from './_components/video';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTechniques().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getTechnique((await params).slug);
  if (!t) {
    return {};
  }
  return {
    title: `${t.name} — ${t.translation.ru}`,
    description: `${t.name} (${t.translation.en}): описание техники дзюдо, шаги выполнения и типичные ошибки.`,
  };
}

export default async function TechniquePage({ params }: Props) {
  const t = getTechnique((await params).slug);
  if (!t) {
    notFound();
  }
  return (
    <article>
      <PageHeader
        title={t.name}
        titleAside={t.kanji ? <span lang="ja">{t.kanji}</span> : undefined}
        subtitle={(
          <>
            {t.translation.ru}
            <span className="text-base">
              {' · '}
              <span lang="en">{t.translation.en}</span>
            </span>
          </>
        )}
      />
      {t.prohibited && <Note tone="danger" title={`Внимание: ${t.prohibited}.`} />}
      {t.safetyNote && <Note tone="danger" title="Безопасность">{t.safetyNote.ru}</Note>}
      {t.competitionNote && <Note tone="info" title="Правила соревнований">{t.competitionNote}</Note>}
      <Facts technique={t} />
      {t.videoUrl && (
        <Section title="Видео">
          <Video url={t.videoUrl} title={`${t.name} — видео`} />
        </Section>
      )}
      {t.steps ? (
        <Section title="Как выполнять" description={t.category === 'nage-waza' || t.category === 'katame-waza' ? RIGHT_GRIP_NOTE : undefined}>
          <Steps steps={t.steps.ru} isThrow={t.category === 'nage-waza'} />
        </Section>
      ) : t.description ? (
        <Section title="Описание">
          <p>{t.description.ru}</p>
        </Section>
      ) : (
        <p className="mt-10 text-text-muted">Описание шагов для этой техники пока готовится.</p>
      )}
      {t.commonMistake && (
        <Section title="Типичная ошибка на экзамене">
          <p className="rounded-lg border-l-4 border-accent bg-surface p-4">{t.commonMistake.ru}</p>
        </Section>
      )}
    </article>
  );
}
