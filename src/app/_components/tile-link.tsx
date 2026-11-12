import Link from 'next/link';

type Props = {
  href: string;
  title: string;
  subtitle: string;
  count: number;
};

export function TileLink({ href, title, subtitle, count }: Props) {
  return (
    <Link
      href={href}
      className="
        block h-full rounded-lg border border-border bg-surface p-4 transition
        hover:border-accent hover:shadow-sm
      "
    >
      <span className="block font-semibold text-primary">{title}</span>
      <span className="block text-sm text-text-muted">{subtitle}</span>
      <span className="mt-2 block text-xs text-text-muted">
        Техник:
        {' '}
        {count}
      </span>
    </Link>
  );
}
