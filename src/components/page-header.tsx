import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: ReactNode;
  /** Рядом с заголовком, например кандзи. */
  titleAside?: ReactNode;
};

export function PageHeader({ title, subtitle, titleAside }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-primary">
        {title}
        {titleAside && (
          <span className="ml-3 text-2xl font-normal text-text-muted">{titleAside}</span>
        )}
      </h1>
      {subtitle && <p className="mt-2 text-lg text-text-muted">{subtitle}</p>}
    </div>
  );
}
