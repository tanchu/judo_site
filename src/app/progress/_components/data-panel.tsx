'use client';

import { useState } from 'react';
import { Section } from '@/components/section';
import { getProgressRepository } from '@/lib/progress';
import { isProgressExport } from '@/lib/progress/merge';
import { encodeSnapshot } from '@/lib/progress/snapshot';

const button = `
  rounded-lg border border-border bg-surface px-4 py-2 font-semibold
  hover:border-primary
`;

/** Перенос данных между устройствами без аккаунта: файл JSON и ссылка-снимок. */
export function DataPanel() {
  const [message, setMessage] = useState<string | null>(null);

  const download = async () => {
    const data = await getProgressRepository().exportAll();
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `judo-progress-${data.exportedAt.slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Файл сохранён. Откройте его на другом устройстве через «Загрузить из файла».');
  };

  const upload = async (file: File) => {
    try {
      const data: unknown = JSON.parse(await file.text());
      if (!isProgressExport(data)) {
        setMessage('Это не файл прогресса с этого сайта.');
        return;
      }
      await getProgressRepository().importAll(data);
      setMessage('Данные загружены и объединены с текущими: по каждой записи осталась более свежая.');
    } catch {
      setMessage('Не удалось прочитать файл.');
    }
  };

  const share = async () => {
    const repo = getProgressRepository();
    const [statuses, items] = await Promise.all([repo.getStatuses(), repo.getCustomItems()]);
    const hash = encodeSnapshot({
      statuses: Object.fromEntries(
        statuses.flatMap((s) => (s.status === 'none' ? [] : [[s.techniqueSlug, s.status]])),
      ),
      items: items.map((i) => ({ text: i.text, done: i.done })),
    });
    const url = `${location.origin}/snapshot/#${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Ссылка скопирована. По ней видно ваш чек-лист — без истории тестов и без входа.');
    } catch {
      setMessage(`Скопируйте ссылку вручную: ${url}`);
    }
  };

  const clear = async () => {
    if (window.confirm('Удалить все отметки, свои пункты и историю тестов из этого браузера? Отменить нельзя.')) {
      await getProgressRepository().clearAll();
      setMessage('Данные удалены.');
    }
  };

  return (
    <Section
      title="Перенос и резервная копия"
      description="Аккаунтов нет, поэтому данные живут в этом браузере. Очистка браузера их удалит — сохраняйте копию."
    >
      <div
        className="
          flex flex-wrap gap-3
          print:hidden
        "
      >
        <button type="button" className={button} onClick={() => void download()}>Сохранить в файл</button>
        <label
          className={`
            ${button}
            cursor-pointer
            has-focus-visible:outline-2 has-focus-visible:outline-primary
          `}
        >
          Загрузить из файла
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                void upload(file);
              }
              e.target.value = '';
            }}
          />
        </label>
        <button type="button" className={button} onClick={() => void share()}>Ссылка на чек-лист</button>
        <button
          type="button"
          className={`
            ${button}
            text-accent
          `}
          onClick={() => void clear()}
        >
          Удалить всё
        </button>
      </div>
      <p role="status" className="mt-3 min-h-6 text-sm">{message}</p>
    </Section>
  );
}
