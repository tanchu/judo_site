import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  '/',
  '/techniques/',
  '/techniques/o-soto-gari/',
  '/techniques/nami-juji-jime/',
  '/techniques/do-jime/',
  '/groups/osaekomi-waza/',
  '/gokyo/1/',
  '/sets/habukareta/',
  '/quiz/',
  '/progress/',
  '/progress/checklist/',
  '/progress/my-list/',
  '/glossary/',
  '/etiquette/',
  '/about/',
];

for (const path of PAGES) {
  test(`${path}: открывается и без нарушений WCAG 2.2 AA`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
}

test('карточка техники: шаги и типичная ошибка', async ({ page }) => {
  await page.goto('/techniques/o-soto-gari/');
  await expect(page.getByRole('heading', { level: 1, name: 'O-soto-gari' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Как выполнять' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Типичная ошибка на экзамене' })).toBeVisible();
});

test('тест: 10 вопросов от начала до результата', async ({ page }) => {
  await page.goto('/quiz/');
  await page.getByRole('button', { name: 'Начать' }).click();
  for (let i = 0; i < 10; i++) {
    await expect(page.getByText(`Вопрос ${i + 1} из 10`)).toBeVisible();
    await page.getByRole('listitem').getByRole('button').first().click();
    await page.getByRole('button', { name: i === 9 ? 'Завершить' : 'Дальше' }).click();
  }
  await expect(page.getByRole('heading', { name: /Результат: \d+ из 10/ })).toBeVisible();
  await page.getByRole('button', { name: 'Пройти ещё раз' }).click();
  await expect(page.getByRole('heading', { name: 'Последние попытки' })).toBeVisible();
});
