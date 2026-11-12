import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: ReactNode;
};

export function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-primary">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-text-muted">{subtitle}</p>}
    </div>
  );
}
