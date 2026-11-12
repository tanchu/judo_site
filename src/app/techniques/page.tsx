import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { TechniqueList } from '@/components/technique/technique-list';
import { getFundamentals, getSupplementary, getTechniquesByGroup } from '@/lib/dataset';
import { ALL_GROUPS, GROUP_LABELS } from '@/lib/dataset/labels';

export const metadata: Metadata = {
  title: 'Все техники',
  description: '100 техник официальной классификации Кодокана, основы и дополнительные элементы.',
};

export default function TechniquesPage() {
  return (
    <>
      <PageHeader
        title="Все техники"
        subtitle="Официальная классификация Кодокана: 68 бросков (нагэ-вадза) и 32 сковывающих приёма (катамэ-вадза)."
      />
      {ALL_GROUPS.map((g) => (
        <Section key={g} title={`${GROUP_LABELS[g].name} — ${GROUP_LABELS[g].ru}`}>
          <TechniqueList techniques={getTechniquesByGroup(g).filter((t) => t.source === 'official')} />
          <p className="mt-2 text-sm">
            <Link href={`/groups/${g}/`} className="text-primary underline">Вся группа</Link>
          </p>
        </Section>
      ))}
      <Section title="Основы и страховки">
        <TechniqueList techniques={getFundamentals()} />
      </Section>
      <Section title="Дополнительно" description="Элементы вне официального списка: варианты удержаний, уходы, перевороты.">
        <TechniqueList techniques={getSupplementary()} />
      </Section>
    </>
  );
}
