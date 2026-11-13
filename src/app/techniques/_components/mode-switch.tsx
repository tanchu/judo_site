import { cn } from '@/lib/cn';
import { CATALOG_MODES, MODE_LABELS, type CatalogMode } from '../_lib/sections';

type Props = {
  value: CatalogMode;
  onChange: (value: CatalogMode) => void;
};

/** Переключатель рубрикатора: группы Кодокана, Гокё и наборы, пояса. */
export function ModeSwitch({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Группировка"
      className="
        inline-flex flex-wrap rounded-lg border border-border bg-surface p-1
      "
    >
      {CATALOG_MODES.map((mode) => (
        <button
          key={mode}
          type="button"
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-semibold',
            value === mode ? 'bg-primary text-white' : `
              text-text-muted
              hover:text-text
            `,
          )}
        >
          {MODE_LABELS[mode]}
        </button>
      ))}
    </div>
  );
}
