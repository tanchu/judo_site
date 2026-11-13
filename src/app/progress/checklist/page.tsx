import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { getChecklistScopes } from '@/lib/progress/scopes';
import { ChecklistBoard } from './_components/checklist-board';

export const metadata: Metadata = {
  title: 'Чек-лист самооценки',
  description: 'Отметьте по каждой технике: не начинал, учу или уверенно. Данные хранятся только в вашем браузере.',
};

export default function ChecklistPage() {
  return (
    <>
      <PageHeader
        title="Чек-лист самооценки"
        subtitle="Отметьте по каждой технике, насколько вы готовы. Отметки хранятся только в этом браузере."
      />
      <ChecklistBoard scopes={getChecklistScopes()} />
    </>
  );
}
