import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import { BELTS, type BeltChoice } from '@/lib/dataset/belts';

type Props = {
  belt: BeltChoice;
  cumulative: boolean;
  onBeltChange: (belt: BeltChoice) => void;
  onCumulativeChange: (cumulative: boolean) => void;
};

/** Выбор пояса, к экзамену на который готовится человек. */
export function BeltPicker({ belt, cumulative, onBeltChange, onCumulativeChange }: Props) {
  const t = useTranslations('quiz');
  return (
    <fieldset className="rounded-lg border border-border bg-surface p-4">
      <legend className="px-1 font-semibold">{t('belt')}</legend>
      <div className="flex flex-wrap gap-2">
        <label
          className="
            flex cursor-pointer items-center gap-2 rounded-full border
            border-border px-3 py-1.5
          "
        >
          <input type="radio" name="belt" checked={belt === 'all'} onChange={() => onBeltChange('all')} />
          {t('beltAll')}
        </label>
        {BELTS.map((b) => (
          <label
            key={b.id}
            className="
              flex cursor-pointer items-center gap-2 rounded-full border
              border-border px-3 py-1.5
            "
          >
            <input type="radio" name="belt" checked={belt === b.id} onChange={() => onBeltChange(b.id)} />
            <span aria-hidden="true" className={cn('size-3.5 rounded-full', b.swatchClass)} />
            {b.ru}
          </label>
        ))}
      </div>
      {belt !== 'all' && (
        <label className="mt-3 flex items-center gap-2">
          <input type="checkbox" checked={cumulative} onChange={(e) => onCumulativeChange(e.target.checked)} />
          {t('beltCumulative')}
        </label>
      )}
    </fieldset>
  );
}
