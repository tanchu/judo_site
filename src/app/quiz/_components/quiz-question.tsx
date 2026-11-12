'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import type { Question } from '@/lib/quiz/generate';

type Props = {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  instant: boolean;
  onSelect: (option: number) => void;
  onNext: () => void;
};

export function QuizQuestion({ question, index, total, selected, instant, onSelect, onNext }: Props) {
  const t = useTranslations('quiz');
  const revealed = instant && selected !== null;
  const isLast = index === total - 1;

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">{t('question', { current: index + 1, total })}</p>
      <h2 className="text-xl font-semibold">{question.text}</h2>
      <ul className="space-y-2">
        {question.options.map((option, i) => (
          <li key={option}>
            <button
              type="button"
              disabled={revealed}
              aria-pressed={selected === i}
              onClick={() => onSelect(i)}
              className={cn(
                `
                  w-full rounded-lg border border-border bg-surface px-4 py-3
                  text-left
                `,
                `
                  hover:border-primary
                  disabled:cursor-default
                `,
                selected === i && 'border-primary bg-primary-soft',
                revealed && i === question.answer && `
                  border-success bg-success-soft
                `,
                revealed && selected === i && i !== question.answer && `
                  border-accent bg-accent-soft
                `,
              )}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      {revealed && (
        <div role="status" className="rounded-lg bg-surface p-4">
          <p className="font-semibold">
            {selected === question.answer ? t('correct') : t('wrong', { answer: question.options[question.answer] })}
          </p>
          <p className="mt-1">
            {question.explanation}
            {' '}
            <Link
              href={`/techniques/${question.techniqueSlug}/`}
              className="text-primary underline"
            >
              Карточка техники
            </Link>
          </p>
        </div>
      )}
      <button
        type="button"
        disabled={selected === null}
        onClick={onNext}
        className="
          rounded-lg bg-primary px-6 py-2.5 font-semibold text-white
          disabled:opacity-50
        "
      >
        {isLast ? t('finish') : t('next')}
      </button>
    </div>
  );
}
