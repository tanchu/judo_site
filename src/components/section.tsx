import type { ReactNode } from 'react';

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function Section({ title, description, children }: Props) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description && <p className="mt-1 text-text-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
