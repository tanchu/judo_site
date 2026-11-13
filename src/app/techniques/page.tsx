import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { getSyllabus } from '@/lib/dataset';
import { TechniqueCatalog } from './_components/technique-catalog';
import { getCatalog } from './_lib/sections';

export const metadata: Metadata = {
  title: 'Все техники',
  description: '100 техник официальной классификации Кодокана, основы и дополнительные элементы — по группам, наборам и поясам.',
};

export default function TechniquesPage() {
  return (
    <>
      <PageHeader
        title="Все техники"
        subtitle="Официальная классификация Кодокана: 68 бросков (нагэ-вадза) и 32 сковывающих приёма (катамэ-вадза)."
      />
      <p className="mt-2 max-w-3xl text-sm text-text-muted">
        {getSyllabus().description.ru}
      </p>
      <TechniqueCatalog catalog={getCatalog()} />
    </>
  );
}
