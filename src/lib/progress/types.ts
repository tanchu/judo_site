import type { QuizTopic, TopicScore } from '@/lib/quiz/generate';

/**
 * Данные пользователя (бриф, стр. 6). Этап A — только в браузере; поля повторяют коллекции
 * PocketBase этапа B (`checklist_status`, `custom_items`, `exam_attempts`), чтобы синхронизация
 * легла без миграции. Все даты — ISO-строки, `updatedAt` нужен для слияния «последняя запись побеждает».
 */
export const CHECKLIST_STATUSES = ['none', 'learning', 'confident'] as const;
export type ChecklistStatus = (typeof CHECKLIST_STATUSES)[number];

export type StatusRecord = {
  techniqueSlug: string;
  status: ChecklistStatus;
  updatedAt: string;
};

export type CustomItem = {
  /** 15 символов [a-z0-9] — формат id PocketBase. */
  id: string;
  text: string;
  done: boolean;
  position: number;
  updatedAt: string;
  /** Мягкое удаление: запись должна дойти до сервера при синхронизации. */
  deletedAt: string | null;
};

export type ExamAttempt = {
  id: string;
  testType: 'generated';
  topics: QuizTopic[];
  questionCount: number;
  score: number;
  byTopic: TopicScore[];
  startedAt: string;
  finishedAt: string;
  updatedAt: string;
};

export type NewAttempt = Omit<ExamAttempt, 'id' | 'updatedAt'>;

export type ProgressExport = {
  format: 'judo-progress';
  version: 1;
  exportedAt: string;
  statuses: StatusRecord[];
  customItems: CustomItem[];
  attempts: ExamAttempt[];
};

/**
 * Единственная точка доступа к данным пользователя. Этап A — `LocalRepository` (IndexedDB);
 * на этапе B локальная база остаётся основной, а синхронизация с PocketBase работает поверх неё.
 */
export interface ProgressRepository {
  /** Однократная подготовка (перенос старых данных). Вызывается вне `liveQuery`. */
  init(): Promise<void>;

  getStatuses(): Promise<StatusRecord[]>;
  setStatus(techniqueSlug: string, status: ChecklistStatus): Promise<void>;

  /** Без удалённых, по `position`. */
  getCustomItems(): Promise<CustomItem[]>;
  addCustomItem(text: string): Promise<CustomItem>;
  updateCustomItem(id: string, patch: Partial<Pick<CustomItem, 'text' | 'done'>>): Promise<void>;
  deleteCustomItem(id: string): Promise<void>;
  moveCustomItem(id: string, direction: -1 | 1): Promise<void>;

  /** Новые сверху. */
  getAttempts(): Promise<ExamAttempt[]>;
  saveAttempt(attempt: NewAttempt): Promise<ExamAttempt>;

  exportAll(): Promise<ProgressExport>;
  /** Слияние с текущими данными по `updatedAt`. */
  importAll(data: ProgressExport): Promise<void>;
  clearAll(): Promise<void>;
}
