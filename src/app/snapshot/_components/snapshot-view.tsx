'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useSyncExternalStore } from 'react';
import { getProgressRepository } from '@/lib/progress';
import type { ChecklistScope } from '@/lib/progress/scopes';
import { decodeSnapshot, type Snapshot } from '@/lib/progress/snapshot';

type Props = {
  scopes: ChecklistScope[];
};

const subscribe = (listener: () => void) => {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
};

export function SnapshotView({ scopes }: Props) {
  const t = useTranslations('progress');
  const hash = useSyncExternalStore(subscribe, () => location.hash.slice(1), () => null);
  const [saved, setSaved] = useState(false);
  if (hash === null) {
    return <p className="text-text-muted">{t('loading')}</p>;
  }
  const snapshot = decodeSnapshot(hash);
  if (!snapshot) {
    return <p>Ссылка повреждена или неполная. Попросите отправить её ещё раз.</p>;
  }

  const groups = scopes
    .map((scope) => ({ ...scope, techniques: scope.techniques.filter((tech) => snapshot.statuses[tech.slug]) }))
    .filter((scope) => scope.techniques.length > 0);

  return (
    <div className="space-y-8">
      {groups.length === 0 && snapshot.items.length === 0 && <p>В этом чек-листе пока ничего не отмечено.</p>}
      {groups.map((scope) => (
        <section key={scope.id}>
          <h2 className="text-xl font-semibold">{scope.title}</h2>
          <ul
            className="
              mt-2 divide-y divide-border rounded-lg border border-border
              bg-surface
            "
          >
            {scope.techniques.map((tech) => (
              <li key={tech.slug} className="flex justify-between gap-3 p-3">
                <Link
                  href={`/techniques/${tech.slug}/`}
                  className="text-primary underline"
                >{tech.name}
                </Link>
                <span>{t(`status.${snapshot.statuses[tech.slug] ?? 'none'}`)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {snapshot.items.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold">Свои пункты</h2>
          <ul
            className="
              mt-2 divide-y divide-border rounded-lg border border-border
              bg-surface
            "
          >
            {snapshot.items.map((item, i) => (
              // Порядок пунктов в ссылке не меняется — индекс устойчив.
              // eslint-disable-next-line @eslint-react/no-array-index-key
              <li key={i} className="flex gap-3 p-3">
                <span aria-hidden="true">{item.done ? '☑' : '☐'}</span>
                <span className={item.done ? 'text-text-muted line-through' : ''}>{item.text}</span>
                <span className="sr-only">{item.done ? '(выполнено)' : '(не выполнено)'}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <SaveButton snapshot={snapshot} saved={saved} onSaved={() => setSaved(true)} />
    </div>
  );
}

function SaveButton({ snapshot, saved, onSaved }: { snapshot: Snapshot; saved: boolean; onSaved: () => void }) {
  if (saved) {
    return (
      <p role="status">
        {'Сохранено. '}
        <Link href="/progress/" className="text-primary underline">Открыть мой прогресс</Link>
      </p>
    );
  }
  const save = async () => {
    if (!window.confirm('Отметки по техникам из ссылки заменят ваши, свои пункты добавятся к вашим. Продолжить?')) {
      return;
    }
    const repo = getProgressRepository();
    const existing = new Set((await repo.getCustomItems()).map((i) => i.text));
    for (const [slug, status] of Object.entries(snapshot.statuses)) {
      if (status) {
        await repo.setStatus(slug, status);
      }
    }
    for (const item of snapshot.items.filter((i) => !existing.has(i.text))) {
      const added = await repo.addCustomItem(item.text);
      if (item.done) {
        await repo.updateCustomItem(added.id, { done: true });
      }
    }
    onSaved();
  };
  return (
    <button
      type="button"
      onClick={() => void save()}
      className="
        rounded-lg bg-primary px-5 py-2.5 font-semibold text-white
        hover:bg-primary/90
      "
    >
      Сохранить себе в этом браузере
    </button>
  );
}
