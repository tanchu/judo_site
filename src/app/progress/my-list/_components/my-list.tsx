'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { getProgressRepository } from '@/lib/progress';
import { useCustomItems } from '@/lib/progress/hooks';
import { PrintButton } from '../../_components/print-button';
import { MyListItem } from './my-list-item';

/** Подсказки для пустого списка — пользователь может добавить их одним нажатием. */
const SUGGESTIONS = [
  'Уточнить у тренера программу экзамена',
  'Постирать кимоно, проверить пояс',
  'Подстричь ногти на руках и ногах',
  'Повторить поклоны и порядок выхода на татами',
];

export function MyList() {
  const t = useTranslations('progress');
  const items = useCustomItems();
  const [text, setText] = useState('');

  const add = (value: string) => {
    const trimmed = value.trim();
    if (trimmed) {
      void getProgressRepository().addCustomItem(trimmed);
    }
  };

  if (items === undefined) {
    return <p className="text-text-muted">{t('loading')}</p>;
  }
  const taken = new Set(items.map((i) => i.text));
  const suggestions = SUGGESTIONS.filter((s) => !taken.has(s));

  return (
    <div className="space-y-6">
      <form
        className="
          flex flex-wrap gap-2
          print:hidden
        "
        onSubmit={(e) => {
          e.preventDefault();
          add(text);
          setText('');
        }}
      >
        <label htmlFor="new-item" className="sr-only">Новый пункт</label>
        <input
          id="new-item"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={300}
          placeholder="Например: повторить Гокё, 2-я группа"
          className="
            min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2
          "
        />
        <button
          type="submit"
          className="
            rounded-lg bg-primary px-5 py-2 font-semibold text-white
            hover:bg-primary/90
          "
        >
          Добавить
        </button>
      </form>

      {items.length > 0 && (
        <>
          <p className="text-text-muted">{`Выполнено: ${items.filter((i) => i.done).length} из ${items.length}`}</p>
          <ul
            className="
              divide-y divide-border rounded-lg border border-border bg-surface
            "
          >
            {items.map((item, index) => (
              <MyListItem key={item.id} item={item} isFirst={index === 0} isLast={index === items.length - 1} />
            ))}
          </ul>
          <PrintButton />
        </>
      )}

      {suggestions.length > 0 && (
        <div className="print:hidden">
          <p className="font-semibold">{items.length === 0 ? 'Список пуст. Можно начать с этих пунктов:' : 'Ещё идеи:'}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => add(s)}
                  className="
                    rounded-full border border-dashed border-border bg-surface
                    px-3 py-1 text-sm
                    hover:border-primary
                  "
                >
                  {`+ ${s}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
