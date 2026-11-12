import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { MyList } from './_components/my-list';

export const metadata: Metadata = {
  title: 'Мой чек-лист к экзамену',
  description: 'Свой список дел перед экзаменом на пояс: добавить, отметить, распечатать. Хранится только в вашем браузере.',
};

export default function MyListPage() {
  return (
    <>
      <PageHeader
        title="Мой чек-лист к экзамену"
        subtitle="Всё, что важно не забыть: от требований тренера до чистого кимоно. Пункты хранятся только в этом браузере."
      />
      <MyList />
    </>
  );
}
