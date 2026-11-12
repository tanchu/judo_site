'use client';

import { useState } from 'react';
import type { TechniqueEntry } from '@/lib/dataset/types';
import { generateQuiz, type Question } from '@/lib/quiz/generate';
import { saveAttempt } from './history';
import { QuizHistory } from './quiz-history';
import { QuizQuestion } from './quiz-question';
import { QuizResult } from './quiz-result';
import { QuizSetup, type QuizSettings } from './quiz-setup';

type Props = {
  techniques: TechniqueEntry[];
};

type Run = {
  questions: Question[];
  answers: (number | null)[];
  index: number;
  instant: boolean;
  done: boolean;
};

export function Quiz({ techniques }: Props) {
  const [run, setRun] = useState<Run | null>(null);

  const start = ({ topics, count, instant }: QuizSettings) => {
    const questions = generateQuiz(techniques, topics, count);
    setRun({ questions, answers: questions.map(() => null), index: 0, instant, done: false });
  };

  if (!run) {
    return (
      <>
        <QuizSetup onStart={start} />
        <QuizHistory />
      </>
    );
  }

  if (run.done) {
    return <QuizResult questions={run.questions} answers={run.answers} onRestart={() => setRun(null)} />;
  }

  const select = (option: number) => {
    setRun({ ...run, answers: run.answers.map((a, i) => (i === run.index ? option : a)) });
  };

  const next = () => {
    if (run.index < run.questions.length - 1) {
      setRun({ ...run, index: run.index + 1 });
      return;
    }
    const score = run.questions.filter((q, i) => run.answers[i] === q.answer).length;
    saveAttempt({ date: new Date().toISOString(), score, total: run.questions.length });
    setRun({ ...run, done: true });
  };

  return (
    <QuizQuestion
      key={run.index}
      question={run.questions[run.index]}
      index={run.index}
      total={run.questions.length}
      selected={run.answers[run.index]}
      instant={run.instant}
      onSelect={select}
      onNext={next}
    />
  );
}
