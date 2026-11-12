'use client';

import { useTranslations } from 'next-intl';
import { scoreByTopic, type Question } from '@/lib/quiz/generate';

type Props = {
  questions: Question[];
  answers: (number | null)[];
  onRestart: () => void;
};

export function QuizResult({ questions, answers, onRestart }: Props) {
  const t = useTranslations('quiz');
  const scores = scoreByTopic(questions, answers);
  const score = scores.reduce((sum, s) => sum + s.correct, 0);
  const mistakes = questions.filter((q, i) => answers[i] !== q.answer);

  return (
    <div className="space-y-6" role="status">
      <h2 className="text-2xl font-bold">{t('result', { score, total: questions.length })}</h2>
      <section>
        <h3 className="font-semibold">{t('byTopic')}</h3>
        <ul className="mt-2 space-y-1">
          {scores.map((s) => (
            <li key={s.topic}>
              {`${t(`topics.${s.topic}`)}: ${s.correct} / ${s.total}`}
            </li>
          ))}
        </ul>
      </section>
      {mistakes.length > 0 && (
        <section>
          <h3 className="font-semibold">Разбор ошибок</h3>
          <ul className="mt-2 space-y-2">
            {mistakes.map((q) => (
              <li
                key={q.id}
                className="rounded-lg border border-border bg-surface p-3"
              >
                <p>{q.text}</p>
                <p className="text-sm text-text-muted">{q.explanation}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <button
        type="button"
        onClick={onRestart}
        className="
          rounded-lg bg-accent px-6 py-2.5 font-semibold text-white
          hover:bg-accent/90
        "
      >
        {t('again')}
      </button>
    </div>
  );
}
