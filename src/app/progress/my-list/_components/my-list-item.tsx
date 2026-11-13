'use client';

import { getProgressRepository } from '@/lib/progress';
import type { CustomItem } from '@/lib/progress/types';

type Props = {
  item: CustomItem;
  isFirst: boolean;
  isLast: boolean;
};

const iconButton = `
  rounded-sm px-2 py-1 text-text-muted
  hover:bg-border/40 hover:text-text
  disabled:opacity-30
`;

export function MyListItem({ item, isFirst, isLast }: Props) {
  const repo = getProgressRepository();
  const checkboxId = `item-${item.id}`;
  return (
    <li
      className="
        flex items-center gap-3 p-3
        print:break-inside-avoid
      "
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={item.done}
        onChange={(e) => void repo.updateCustomItem(item.id, { done: e.target.checked })}
        className="size-5 shrink-0"
      />
      <label
        htmlFor={checkboxId}
        className={item.done ? 'flex-1 text-text-muted line-through' : 'flex-1'}
      >
        {item.text}
      </label>
      <div
        className="
          flex shrink-0
          print:hidden
        "
      >
        <button
          type="button"
          disabled={isFirst}
          onClick={() => void repo.moveCustomItem(item.id, -1)}
          aria-label={`Выше: ${item.text}`}
          className={iconButton}
        >
          ↑
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={() => void repo.moveCustomItem(item.id, 1)}
          aria-label={`Ниже: ${item.text}`}
          className={iconButton}
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => void repo.deleteCustomItem(item.id)}
          aria-label={`Удалить: ${item.text}`}
          className={iconButton}
        >
          ✕
        </button>
      </div>
    </li>
  );
}
