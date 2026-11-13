'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Section } from '@/components/section';
import { TechniqueList } from '@/components/technique/technique-list';
import type { BeltChoice } from '@/lib/dataset/belts';
import type { CatalogMode, CatalogSection } from '../_lib/sections';
import { BeltFilter } from './belt-filter';
import { ModeSwitch } from './mode-switch';

type Props = {
  catalog: Record<CatalogMode, CatalogSection[]>;
};

/** Рубрикатор списка техник: группировка + фильтр по поясу. Внутри разделов — сортировка по поясам. */
export function TechniqueCatalog({ catalog }: Props) {
  const [mode, setMode] = useState<CatalogMode>('groups');
  const [belt, setBelt] = useState<BeltChoice>('all');

  const sections = catalog[mode]
    .map((s) => ({ ...s, techniques: belt === 'all' ? s.techniques : s.techniques.filter((t) => t.belt === belt) }))
    .filter((s) => s.techniques.length > 0);
  const total = sections.reduce((sum, s) => sum + s.techniques.length, 0);

  return (
    <>
      <div
        className="
          sticky top-0 z-10 -mx-4 mt-6 flex flex-col gap-3 border-b
          border-border bg-bg/95 px-4 py-3 backdrop-blur-sm
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <ModeSwitch value={mode} onChange={setMode} />
        <BeltFilter value={belt} onChange={setBelt} />
      </div>
      <p className="mt-3 text-sm text-text-muted" aria-live="polite">
        Показано техник: {total}
      </p>
      {sections.map((s) => (
        <Section key={s.id} title={s.title} description={s.description}>
          <TechniqueList techniques={s.techniques} />
          {s.href && (
            <p className="mt-2 text-sm">
              <Link href={s.href} className="text-primary underline">Открыть раздел</Link>
            </p>
          )}
        </Section>
      ))}
    </>
  );
}
