import { cn } from '@/lib/cn';
import { BELTS, type BeltChoice } from '@/lib/dataset/belts';

type Props = {
  value: BeltChoice;
  onChange: (value: BeltChoice) => void;
};

const chip = `
  flex h-9 min-w-9 items-center justify-center rounded-full border-2 px-3 text-sm
  font-semibold
`;

/** Фильтр по поясу: «Все» и кружки цветов поясов. */
export function BeltFilter({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Пояс"
      className="flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        aria-pressed={value === 'all'}
        onClick={() => onChange('all')}
        className={cn(chip, value === 'all' ? `
          border-primary bg-primary-soft text-primary
        ` : 'border-border bg-surface')}
      >
        Все
      </button>
      {BELTS.map((b) => (
        <button
          key={b.id}
          type="button"
          aria-pressed={value === b.id}
          aria-label={b.ru}
          title={b.ru}
          onClick={() => onChange(b.id)}
          className={cn(chip, 'w-9 px-0', value === b.id ? 'border-primary' : `
            border-transparent
          `)}
        >
          <span aria-hidden="true" className={cn('size-6 rounded-full', b.swatchClass)} />
        </button>
      ))}
    </div>
  );
}
