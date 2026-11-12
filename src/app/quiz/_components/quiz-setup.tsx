'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUIZ_SIZES, QUIZ_TOPICS, type QuizTopic } from '@/lib/quiz/generate';

export type QuizSettings = {
  topics: QuizTopic[];
  count: number;
  instant: boolean;
};

type Props = {
  onStart: (settings: QuizSettings) => void;
};

const fieldset = 'rounded-lg border border-border bg-surface p-4';
const legend = 'px-1 font-semibold';

export function QuizSetup({ onStart }: Props) {
  const t = useTranslations('quiz');
  const [topics, setTopics] = useState<QuizTopic[]>([...QUIZ_TOPICS]);
  const [count, setCount] = useState<number>(QUIZ_SIZES[0]);
  const [instant, setInstant] = useState(true);

  const toggleTopic = (topic: QuizTopic) => {
    setTopics((prev) => (prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic]));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onStart({ topics, count, instant });
      }}
    >
      <fieldset className={fieldset}>
        <legend className={legend}>{t('type')}</legend>
        {QUIZ_TOPICS.map((topic) => (
          <label key={topic} className="flex items-center gap-2 py-1">
            <input type="checkbox" checked={topics.includes(topic)} onChange={() => toggleTopic(topic)} />
            {t(`topics.${topic}`)}
          </label>
        ))}
      </fieldset>
      <fieldset className={fieldset}>
        <legend className={legend}>{t('count')}</legend>
        <div className="flex gap-4">
          {QUIZ_SIZES.map((size) => (
            <label key={size} className="flex items-center gap-2">
              <input type="radio" name="count" checked={count === size} onChange={() => setCount(size)} />
              {size}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className={fieldset}>
        <legend className={legend}>{t('mode')}</legend>
        <label className="flex items-center gap-2 py-1">
          <input type="radio" name="mode" checked={instant} onChange={() => setInstant(true)} />
          {t('modeInstant')}
        </label>
        <label className="flex items-center gap-2 py-1">
          <input type="radio" name="mode" checked={!instant} onChange={() => setInstant(false)} />
          {t('modeEnd')}
        </label>
      </fieldset>
      <button
        type="submit"
        disabled={topics.length === 0}
        className="
          rounded-lg bg-accent px-6 py-2.5 font-semibold text-white
          hover:bg-accent/90
          disabled:opacity-50
        "
      >
        {t('start')}
      </button>
    </form>
  );
}
