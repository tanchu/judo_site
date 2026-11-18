import { defineNextConfig } from '@tanchu/eslint-config';

// Правила — в @tanchu/eslint-config (README пакета, tanchu/dev-standards). Здесь — только
// настройки проекта.
export default defineNextConfig({
  tsconfigRootDir: import.meta.dirname,
  tailwind: {
    entryPoint: 'src/app/globals.css',
  },
  // Справочные материалы (исходные скрипты сборки набора данных и т. п.).
  ignores: ['docs/**'],
});
