'use client';

import { useTranslations } from 'next-intl';
import { useHistory } from './history';

export function QuizHistory() {
  const t = useTranslations('quiz');
  const history = useHistory();
  if (history.length === 0) {
    return null;
  }
  return (
    <section className="mt-8">
      <h2 className="font-semibold">{t('history')}</h2>
      <ul className="mt-2 space-y-1 text-sm text-text-muted">
        {history.map((a) => (
          <li key={a.date}>
            {`${new Date(a.date).toLocaleString('ru')}: ${a.score} / ${a.total}`}
          </li>
        ))}
      </ul>
    </section>
  );
}
