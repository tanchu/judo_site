import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { AttemptHistory } from '@/components/progress/attempt-history';
import { getChecklistScopes } from '@/lib/progress/scopes';
import { DataPanel } from './_components/data-panel';
import { Overview } from './_components/overview';

export const metadata: Metadata = {
  title: 'Мой прогресс',
  description: 'Самооценка по техникам, свой чек-лист к экзамену и история тестов. Без регистрации: всё хранится в вашем браузере.',
};

export default function ProgressPage() {
  const slugs = getChecklistScopes().flatMap((s) => s.techniques.map((t) => t.slug));
  return (
    <>
      <PageHeader
        title="Мой прогресс"
        subtitle="Без регистрации: всё хранится только в этом браузере. Чтобы перенести на другое устройство — сохраните файл или ссылку."
      />
      <Overview totalTechniques={slugs.length} />
      <AttemptHistory title="История тестов" />
      <DataPanel />
    </>
  );
}
