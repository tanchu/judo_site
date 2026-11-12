import Link from 'next/link';
import { Section } from '@/components/section';
import { TechniqueList } from '@/components/technique/technique-list';
import {
  GOKYO_NUMBERS,
  datasetMeta,
  getFundamentals,
  getGokyoTechniques,
  getTechniquesByGroup,
} from '@/lib/dataset';
import { GROUP_LABELS, KATAME_GROUPS } from '@/lib/dataset/labels';
import { TileLink } from './_components/tile-link';

export default function HomePage() {
  return (
    <>
      <div className="rounded-2xl bg-primary px-6 py-10 text-white">
        <h1
          className="
            text-3xl font-bold
            sm:text-4xl
          "
        >Подготовка к экзамену на пояс по дзюдо
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/85">
          Бесплатный справочник техник по классификации Кодокана и пробные тесты. Без регистрации и оплаты.
        </p>
        <p className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/quiz/"
            className="
              rounded-lg bg-accent px-5 py-2.5 font-semibold
              hover:bg-accent/90
            "
          >
            Пройти тест
          </Link>
          <Link
            href="/techniques/"
            className="
              rounded-lg border border-white/60 px-5 py-2.5 font-semibold
              hover:bg-white/10
            "
          >
            Все техники (
            {datasetMeta.counts.official}
            )
          </Link>
        </p>
      </div>

      <Section title="Гокё-но-вадза" description="40 основных бросков Кодокана в пяти группах — порядок изучения.">
        <ul
          className="
            grid gap-3
            sm:grid-cols-3
            lg:grid-cols-5
          "
        >
          {GOKYO_NUMBERS.map((n) => (
            <li key={n}>
              <TileLink
                href={`/gokyo/${n}/`}
                title={`${n}-я группа`}
                subtitle={getGokyoTechniques(n).slice(0, 2).map((t) => t.name).join(', ') + '…'}
                count={getGokyoTechniques(n).length}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Катамэ-вадза" description="Сковывающие приёмы в партере: удержания, удушения, болевые.">
        <ul
          className="
            grid gap-3
            sm:grid-cols-3
          "
        >
          {KATAME_GROUPS.map((g) => (
            <li key={g}>
              <TileLink
                href={`/groups/${g}/`}
                title={GROUP_LABELS[g].name}
                subtitle={GROUP_LABELS[g].ru}
                count={getTechniquesByGroup(g).length}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Основы и страховки" description="Поклоны, захваты, выведение из равновесия, падения.">
        <TechniqueList techniques={getFundamentals()} />
      </Section>
    </>
  );
}
