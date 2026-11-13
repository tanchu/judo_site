import type { BeltId } from './types';

type Belt = {
  id: BeltId;
  /** «Жёлтый пояс». */
  ru: string;
  /** Рамка карточки и кружок в фильтре — цвета из `@theme` в globals.css. */
  borderClass: string;
  swatchClass: string;
};

/** Порядок — от первого экзамена к чёрному поясу. */
export const BELTS: Belt[] = [
  { id: 'yellow', ru: 'Жёлтый пояс', borderClass: 'border-belt-yellow', swatchClass: 'bg-belt-yellow' },
  { id: 'orange', ru: 'Оранжевый пояс', borderClass: 'border-belt-orange', swatchClass: 'bg-belt-orange' },
  { id: 'green', ru: 'Зелёный пояс', borderClass: 'border-belt-green', swatchClass: 'bg-belt-green' },
  { id: 'blue', ru: 'Синий пояс', borderClass: 'border-belt-blue', swatchClass: 'bg-belt-blue' },
  { id: 'brown', ru: 'Коричневый пояс', borderClass: 'border-belt-brown', swatchClass: 'bg-belt-brown' },
  { id: 'black', ru: 'Чёрный пояс', borderClass: 'border-belt-black', swatchClass: 'bg-belt-black' },
];

/** Выбор в фильтрах: конкретный пояс или все. */
export type BeltChoice = BeltId | 'all';

const byId = new Map(BELTS.map((b) => [b.id, b]));

export function getBelt(id: BeltId): Belt {
  return byId.get(id) ?? BELTS[0];
}

export function beltRank(id: BeltId): number {
  return BELTS.findIndex((b) => b.id === id);
}

export function isBeltId(value: string): value is BeltId {
  return byId.has(value as BeltId);
}

/** Стабильная сортировка по поясу: внутри пояса сохраняется исходный порядок (порядок Кодокана). */
export function sortByBelt<T extends { belt: BeltId }>(items: readonly T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => beltRank(a.item.belt) - beltRank(b.item.belt) || a.index - b.index)
    .map(({ item }) => item);
}

/**
 * Техники для экзамена на пояс: по умолчанию — накопительно, вместе с предыдущими поясами
 * (так устроены экзамены), либо только новые для этого пояса.
 */
export function filterForBelt<T extends { belt: BeltId }>(items: readonly T[], belt: BeltId, cumulative: boolean): T[] {
  const rank = beltRank(belt);
  return items.filter((t) => (cumulative ? beltRank(t.belt) <= rank : t.belt === belt));
}
