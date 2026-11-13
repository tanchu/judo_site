import { cn } from '@/lib/cn';
import type { ChecklistScope } from '@/lib/progress/scopes';
import type { ChecklistStatus } from '@/lib/progress/types';

type Props = {
  scopes: ChecklistScope[];
  statuses: Map<string, ChecklistStatus> | undefined;
  current: string;
  onSelect: (id: string) => void;
};

const confidentIn = (scope: ChecklistScope, statuses: Props['statuses']) =>
  scope.techniques.filter((t) => statuses?.get(t.slug) === 'confident').length;

/** Выбор набора и прогресс по каждому: сколько техник отмечено «уверенно». На телефоне — список. */
export function ScopeSummary({ scopes, statuses, current, onSelect }: Props) {
  return (
    <>
      <label
        className="
          flex flex-col gap-1
          sm:hidden
          print:hidden
        "
      >
        <span className="text-sm text-text-muted">Набор техник</span>
        <select
          value={current}
          onChange={(e) => onSelect(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2"
        >
          {scopes.map((scope) => (
            <option key={scope.id} value={scope.id}>
              {`${scope.title} — ${confidentIn(scope, statuses)}/${scope.techniques.length}`}
            </option>
          ))}
        </select>
      </label>
      <ScopeTiles scopes={scopes} statuses={statuses} current={current} onSelect={onSelect} />
    </>
  );
}

function ScopeTiles({ scopes, statuses, current, onSelect }: Props) {
  return (
    <nav
      aria-label="Наборы техник"
      className="
        hidden
        sm:block
        print:hidden
      "
    >
      <ul
        className="
          grid gap-2
          sm:grid-cols-3
          lg:grid-cols-4
        "
      >
        {scopes.map((scope) => {
          const confident = confidentIn(scope, statuses);
          const total = scope.techniques.length;
          return (
            <li key={scope.id}>
              <button
                type="button"
                aria-pressed={scope.id === current}
                onClick={() => onSelect(scope.id)}
                className={cn(
                  'w-full rounded-lg border p-3 text-left transition',
                  scope.id === current ? 'border-primary bg-primary-soft' : `
                    border-border bg-surface
                    hover:border-primary
                  `,
                )}
              >
                <span className="block text-sm font-semibold">{scope.title}</span>
                <span className="mt-1 block text-xs text-text-muted">
                  {statuses ? `Уверенно: ${confident} из ${total}` : `${total} техник`}
                </span>
                <span
                  aria-hidden="true"
                  className="
                    mt-2 block h-1.5 overflow-hidden rounded-full bg-border
                  "
                >
                  <span className="block h-full bg-success" style={{ width: `${(confident / total) * 100}%` }} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
