import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  tone: 'danger' | 'info';
  title: string;
  children?: ReactNode;
};

/** Плашка-предупреждение на карточке: запрет, безопасность, правила соревнований. */
export function Note({ tone, title, children }: Props) {
  return (
    <div
      role="note"
      className={cn(
        'mb-6 rounded-lg p-4',
        tone === 'danger' ? 'bg-accent-soft text-accent' : `
          border border-border bg-surface
        `,
      )}
    >
      <p className="font-semibold">{title}</p>
      {children && <p className={cn('mt-1', tone === 'info' && 'text-text-muted')}>{children}</p>}
    </div>
  );
}
