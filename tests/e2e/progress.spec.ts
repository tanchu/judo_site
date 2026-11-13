import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { encodeSnapshot } from '../../src/lib/progress/snapshot';

test('статус на карточке техники попадает в чек-лист и переживает перезагрузку', async ({ page }) => {
  await page.goto('/techniques/seoi-nage/');
  const picker = page.getByRole('group', { name: 'Мой статус: Seoi-nage' });
  await picker.getByText('Уверенно').click();
  await expect(picker.getByRole('radio', { name: 'Уверенно' })).toBeChecked();

  await page.goto('/progress/checklist/');
  await expect(page.getByRole('button', { name: /Гокё, 1-я группа.*Уверенно: 1 из 8/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('group', { name: 'Мой статус: Seoi-nage' }).getByRole('radio', { name: 'Уверенно' }))
    .toBeChecked();

  await page.getByLabel('Показать').selectOption('confident');
  await expect(page.getByRole('link', { name: 'Seoi-nage' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Uki-goshi' })).toHaveCount(0);
});

test('свой чек-лист: добавить, отметить, переставить, удалить', async ({ page }) => {
  await page.goto('/progress/my-list/');
  const input = page.getByLabel('Новый пункт');
  for (const text of ['Постирать кимоно', 'Повторить поклоны']) {
    await input.fill(text);
    await page.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByRole('checkbox', { name: text })).toBeVisible();
  }
  // Запись в IndexedDB асинхронна: кликаем и ждём состояния, а не check().
  await page.getByRole('checkbox', { name: 'Постирать кимоно' }).click();
  await expect(page.getByRole('checkbox', { name: 'Постирать кимоно' })).toBeChecked();
  await expect(page.getByText('Выполнено: 1 из 2')).toBeVisible();

  await page.getByRole('button', { name: 'Выше: Повторить поклоны' }).click();
  await expect(page.getByRole('checkbox').first()).toHaveAccessibleName('Повторить поклоны');

  await page.getByRole('button', { name: 'Удалить: Постирать кимоно' }).click();
  await expect(page.getByRole('checkbox', { name: 'Постирать кимоно' })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Выполнено: 0 из 1')).toBeVisible();
});

test('история тестов: старая из localStorage переносится, новая — с разбивкой по темам', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('judo-quiz-history', JSON.stringify([{ date: '2026-01-05T10:00:00.000Z', score: 7, total: 10 }]));
    }
  });
  await page.goto('/progress/');
  await expect(page.getByText('7 / 10 · 70%')).toBeVisible();

  await page.goto('/quiz/');
  await page.getByLabel('Техника ↔ группа Гокё').uncheck();
  await page.getByLabel('Техника ↔ группа', { exact: true }).uncheck();
  await page.getByRole('button', { name: 'Начать' }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('listitem').getByRole('button').first().click();
    await page.getByRole('button', { name: i === 9 ? 'Завершить' : 'Дальше' }).click();
  }
  await expect(page.getByRole('heading', { name: /Результат/ })).toBeVisible();
  await page.getByRole('button', { name: 'Пройти ещё раз' }).click();
  await expect(page.getByText(/\/ 10 · \d+%/)).toHaveCount(2);
  await page.goto('/progress/');
  await expect(page.getByText(/Название ↔ перевод: \d+\/10/)).toBeVisible();
  await expect(page.getByText(/\/ 10 · \d+%/)).toHaveCount(2);
});

test('экспорт в файл и импорт в чистый браузер', async ({ page, browser }) => {
  await page.goto('/techniques/o-goshi/');
  await page.getByRole('group', { name: /Мой статус/ }).getByText('Учу').click();
  await page.goto('/progress/');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Сохранить в файл' }).click();
  const file = await (await downloadPromise).path();
  const data = JSON.parse(await readFile(file, 'utf8')) as { format: string };
  expect(data.format).toBe('judo-progress');

  const other = await browser.newPage();
  await other.goto('/progress/');
  await other.getByText('Загрузить из файла').locator('input').setInputFiles(file);
  await expect(other.getByRole('status').getByText(/Данные загружены/)).toBeVisible();
  await expect(other.getByRole('link', { name: /Чек-лист самооценки.*учу: 1/ })).toBeVisible();
  await other.close();
});

test('ссылка-снимок открывается без данных в браузере и сохраняется к себе', async ({ page }) => {
  const hash = encodeSnapshot({ statuses: { 'uki-goshi': 'confident' }, items: [{ text: 'Взять пояс', done: true }] });
  await page.goto(`/snapshot/#${hash}`);
  await expect(page.getByRole('link', { name: 'Uki-goshi' })).toBeVisible();
  await expect(page.getByText('Взять пояс')).toBeVisible();
  page.once('dialog', (dialog) => void dialog.accept());
  await page.getByRole('button', { name: 'Сохранить себе в этом браузере' }).click();
  await page.getByRole('link', { name: 'Открыть мой прогресс' }).click();
  await expect(page.getByRole('link', { name: /Чек-лист самооценки.*Уверенно: 1/ })).toBeVisible();

  await page.goto('/snapshot/#garbage');
  await expect(page.getByText('Ссылка повреждена')).toBeVisible();
});
