'use client';

import { useTranslations } from 'next-intl';
import { useAttempts } from '@/lib/progress/hooks';

type Props = {
  title: string;
  limit?: number;
};

const dateFormat = new Intl.DateTimeFormat('ru', { dateStyle: 'medium', timeStyle: 'short' });

/** История тестов с разбивкой по темам. Старые попытки (до v0.3) темы не хранят. */
export function AttemptHistory({ title, limit }: Props) {
  const t = useTranslations('quiz');
  const attempts = useAttempts();
  if (!attempts?.length) {
    return null;
  }
  const shown = limit ? attempts.slice(0, limit) : attempts;
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul
        className="
          mt-3 divide-y divide-border rounded-lg border border-border bg-surface
        "
      >
        {shown.map((a) => (
          <li
            key={a.id}
            className="
              flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 p-3
            "
          >
            <span className="text-text-muted">{dateFormat.format(new Date(a.finishedAt))}</span>
            <span className="font-semibold">
              {`${a.score} / ${a.questionCount} · ${Math.round((a.score / a.questionCount) * 100)}%`}
            </span>
            {a.byTopic.length > 0 && (
              <span className="w-full text-sm text-text-muted">
                {a.byTopic.map((s) => `${t(`topics.${s.topic}`)}: ${s.correct}/${s.total}`).join(' · ')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
