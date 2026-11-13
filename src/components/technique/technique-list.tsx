import type { TechniqueSummary } from '@/lib/dataset/types';
import { TechniqueCard } from './technique-card';

type Props = {
  techniques: TechniqueSummary[];
};

export function TechniqueList({ techniques }: Props) {
  return (
    <ul
      className="
        grid gap-3
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {techniques.map((t) => (
        <li key={t.slug}>
          <TechniqueCard technique={t} />
        </li>
      ))}
    </ul>
  );
}
