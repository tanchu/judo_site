import Dexie, { type EntityTable } from 'dexie';
import { mergeByUpdatedAt, newId } from './merge';
import type {
  ChecklistStatus,
  CustomItem,
  ExamAttempt,
  NewAttempt,
  ProgressExport,
  ProgressRepository,
  StatusRecord,
} from './types';

class ProgressDb extends Dexie {
  statuses!: EntityTable<StatusRecord, 'techniqueSlug'>;
  customItems!: EntityTable<CustomItem, 'id'>;
  attempts!: EntityTable<ExamAttempt, 'id'>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      statuses: 'techniqueSlug',
      customItems: 'id, position',
      attempts: 'id, finishedAt',
    });
  }
}

/** Ключ старой истории тестов в localStorage (до перехода на IndexedDB). */
const LEGACY_HISTORY_KEY = 'judo-quiz-history';
type LegacyAttempt = { date: string; score: number; total: number };

const now = () => new Date().toISOString();

export class LocalRepository implements ProgressRepository {
  private readonly db: ProgressDb;
  private migrated: Promise<void> | null = null;

  constructor(name = 'judo-progress') {
    this.db = new ProgressDb(name);
  }

  /**
   * Однократный перенос истории тестов из localStorage. Не вызывать из `liveQuery`:
   * там Dexie запрещает запись. Ключ удаляется только после успешной записи.
   */
  init(): Promise<void> {
    this.migrated ??= this.migrateLegacyHistory();
    return this.migrated;
  }

  private async migrateLegacyHistory() {
    let raw: string | null;
    try {
      raw = globalThis.localStorage?.getItem(LEGACY_HISTORY_KEY) ?? null;
    } catch {
      return;
    }
    if (!raw) {
      return;
    }
    let legacy: LegacyAttempt[];
    try {
      legacy = JSON.parse(raw) as LegacyAttempt[];
    } catch {
      return;
    }
    await this.db.attempts.bulkPut(legacy.map((a) => ({
      id: newId(),
      testType: 'generated' as const,
      topics: [],
      questionCount: a.total,
      score: a.score,
      byTopic: [],
      startedAt: a.date,
      finishedAt: a.date,
      updatedAt: a.date,
    })));
    globalThis.localStorage.removeItem(LEGACY_HISTORY_KEY);
  }

  async getStatuses() {
    return this.db.statuses.toArray();
  }

  async setStatus(techniqueSlug: string, status: ChecklistStatus) {
    await this.db.statuses.put({ techniqueSlug, status, updatedAt: now() });
  }

  async getCustomItems() {
    const items = await this.db.customItems.orderBy('position').toArray();
    return items.filter((item) => item.deletedAt === null);
  }

  async addCustomItem(text: string) {
    const last = await this.db.customItems.orderBy('position').last();
    const item: CustomItem = {
      id: newId(),
      text,
      done: false,
      position: (last?.position ?? 0) + 1,
      updatedAt: now(),
      deletedAt: null,
    };
    await this.db.customItems.add(item);
    return item;
  }

  async updateCustomItem(id: string, patch: Partial<Pick<CustomItem, 'text' | 'done'>>) {
    await this.db.customItems.update(id, { ...patch, updatedAt: now() });
  }

  async deleteCustomItem(id: string) {
    const time = now();
    await this.db.customItems.update(id, { deletedAt: time, updatedAt: time });
  }

  async moveCustomItem(id: string, direction: -1 | 1) {
    await this.db.transaction('rw', this.db.customItems, async () => {
      const items = await this.getCustomItems();
      const index = items.findIndex((item) => item.id === id);
      const other = items[index + direction];
      if (index === -1 || !other) {
        return;
      }
      const time = now();
      await this.db.customItems.bulkUpdate([
        { key: id, changes: { position: other.position, updatedAt: time } },
        { key: other.id, changes: { position: items[index].position, updatedAt: time } },
      ]);
    });
  }

  async getAttempts() {
    return this.db.attempts.orderBy('finishedAt').reverse().toArray();
  }

  async saveAttempt(attempt: NewAttempt) {
    const saved: ExamAttempt = { ...attempt, id: newId(), updatedAt: now() };
    await this.db.attempts.add(saved);
    return saved;
  }

  async exportAll(): Promise<ProgressExport> {
    await this.init();
    return {
      format: 'judo-progress',
      version: 1,
      exportedAt: now(),
      statuses: await this.db.statuses.toArray(),
      customItems: await this.db.customItems.toArray(),
      attempts: await this.db.attempts.toArray(),
    };
  }

  async importAll(data: ProgressExport) {
    const { db } = this;
    await db.transaction('rw', db.statuses, db.customItems, db.attempts, async () => {
      await db.statuses.bulkPut(
        mergeByUpdatedAt(await db.statuses.toArray(), data.statuses, (s) => s.techniqueSlug),
      );
      await db.customItems.bulkPut(
        mergeByUpdatedAt(await db.customItems.toArray(), data.customItems, (i) => i.id),
      );
      await db.attempts.bulkPut(
        mergeByUpdatedAt(await db.attempts.toArray(), data.attempts, (a) => a.id),
      );
    });
  }

  async clearAll() {
    const { db } = this;
    await db.transaction('rw', db.statuses, db.customItems, db.attempts, async () => {
      await Promise.all([db.statuses.clear(), db.customItems.clear(), db.attempts.clear()]);
    });
  }
}
