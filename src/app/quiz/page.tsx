import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { getOfficialTechniques } from '@/lib/dataset';
import { Quiz } from './_components/quiz';

export const metadata: Metadata = {
  title: 'Тесты',
  description: 'Пробные тесты по технике дзюдо: названия и переводы, группы приёмов, Гокё-но-вадза.',
};

export default function QuizPage() {
  return (
    <>
      <PageHeader
        title="Тесты"
        subtitle="Вопросы собираются случайно из базы техник Кодокана. Вопросы по теории, правилам и этикету появятся позже."
      />
      <Quiz techniques={getOfficialTechniques()} />
    </>
  );
}
