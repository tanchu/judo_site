'use client';

import { TileLink } from '@/app/_components/tile-link';
import { useAttempts, useCustomItems, useStatuses } from '@/lib/progress/hooks';

type Props = {
  totalTechniques: number;
};

export function Overview({ totalTechniques }: Props) {
  const statuses = useStatuses();
  const items = useCustomItems();
  const attempts = useAttempts();
  const counts = { learning: 0, confident: 0 };
  for (const status of statuses?.values() ?? []) {
    if (status !== 'none') {
      counts[status]++;
    }
  }
  const last = attempts?.[0];
  return (
    <ul
      className="
        grid gap-3
        sm:grid-cols-3
      "
    >
      <li>
        <TileLink
          href="/progress/checklist/"
          title="Чек-лист самооценки"
          subtitle={`Уверенно: ${counts.confident}, учу: ${counts.learning} — из ${totalTechniques}`}
        />
      </li>
      <li>
        <TileLink
          href="/progress/my-list/"
          title="Мой чек-лист к экзамену"
          subtitle={items?.length ? `Выполнено ${items.filter((i) => i.done).length} из ${items.length}` : 'Свои пункты'}
        />
      </li>
      <li>
        <TileLink
          href="/quiz/"
          title="Тесты"
          subtitle={last ? `Последний: ${last.score} из ${last.questionCount}` : 'Ещё не проходили'}
        />
      </li>
    </ul>
  );
}
