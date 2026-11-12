import { STEP_NAMES } from '@/lib/dataset/labels';

type Props = {
  steps: string[];
  isThrow: boolean;
};

/** Для бросков шаги подписаны как кузуси / цукури / какэ, для остального — просто нумерованы. */
export function Steps({ steps, isThrow }: Props) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li
          key={step}
          className="flex gap-3 rounded-lg border border-border bg-surface p-4"
        >
          <span
            aria-hidden="true"
            className="
              flex size-8 shrink-0 items-center justify-center rounded-full
              bg-primary font-bold text-white
            "
          >
            {i + 1}
          </span>
          <div>
            {isThrow && <p className="text-sm font-semibold text-primary">{STEP_NAMES[i]}</p>}
            <p>{step}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
