'use client';

import { useState } from 'react';
import type { TechniqueEntry, BeltId } from '@/lib/dataset/types';
import { AttemptHistory } from '@/components/progress/attempt-history';
import { filterForBelt } from '@/lib/dataset/belts';
import { getProgressRepository } from '@/lib/progress';
import { generateQuiz, scoreByTopic, type QuizTopic, type Question } from '@/lib/quiz/generate';
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
  topics: QuizTopic[];
  belt?: BeltId;
  startedAt: string;
  done: boolean;
};

export function Quiz({ techniques }: Props) {
  const [run, setRun] = useState<Run | null>(null);

  const start = ({ topics, count, instant, belt, cumulative }: QuizSettings) => {
    const pool = belt === 'all' ? techniques : filterForBelt(techniques, belt, cumulative);
    const questions = generateQuiz(pool, topics, count);
    setRun({
      questions,
      answers: questions.map(() => null),
      index: 0,
      instant,
      topics,
      belt: belt === 'all' ? undefined : belt,
      startedAt: new Date().toISOString(),
      done: false,
    });
  };

  if (!run) {
    return (
      <>
        <QuizSetup onStart={start} />
        <AttemptHistory title="Последние попытки" limit={5} />
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
    const byTopic = scoreByTopic(run.questions, run.answers);
    void getProgressRepository().saveAttempt({
      testType: 'generated',
      topics: run.topics,
      belt: run.belt,
      questionCount: run.questions.length,
      score: byTopic.reduce((sum, s) => sum + s.correct, 0),
      byTopic,
      startedAt: run.startedAt,
      finishedAt: new Date().toISOString(),
    });
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
