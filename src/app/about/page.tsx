import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { datasetMeta } from '@/lib/dataset';

export const metadata: Metadata = { title: 'О проекте' };

export default function AboutPage() {
  return (
    <>
      <PageHeader title="О проекте" />
      <div className="max-w-2xl space-y-4">
        <p>
          Бесплатный справочник для подготовки к экзамену на пояс по дзюдо: карточки техник и пробные тесты.
          Всё открыто, без регистрации и оплаты.
        </p>
        <p>
          Названия и классификация техник — по официальной номенклатуре Кодокана / IJF. Описания шагов и
          типичных ошибок написаны нами и проходят вычитку.
        </p>
        <p className="rounded-lg bg-accent-soft p-4">
          Сайт не заменяет тренера. Требования к экзамену на каждый пояс определяют национальная федерация и
          ваш додзё — уточняйте программу у тренера.
        </p>
        <p className="text-sm text-text-muted">{datasetMeta.note}</p>
      </div>
    </>
  );
}
