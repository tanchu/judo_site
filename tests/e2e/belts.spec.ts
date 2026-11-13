import { expect, test } from '@playwright/test';

test('список техник: группировка по поясам и фильтр по цвету', async ({ page }) => {
  await page.goto('/techniques/');
  const filter = page.getByRole('group', { name: 'Пояс' });
  await expect(filter.getByRole('button', { name: 'Все' })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('group', { name: 'Группировка' }).getByRole('button', { name: 'По поясам' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'Жёлтый пояс' })).toBeVisible();

  await filter.getByRole('button', { name: 'Зелёный пояс' }).click();
  await expect(filter.getByRole('button', { name: 'Зелёный пояс' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { level: 2, name: 'Жёлтый пояс' })).toBeHidden();
  await expect(page.getByRole('heading', { level: 2, name: 'Зелёный пояс' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Tomoe-nage/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /O-soto-gari/ })).toBeHidden();
});

test('тест к экзамену на жёлтый пояс', async ({ page }) => {
  await page.goto('/quiz/');
  await page.getByRole('radio', { name: 'Жёлтый пояс' }).check();
  await expect(page.getByRole('checkbox', { name: /Включая техники предыдущих поясов/ })).toBeChecked();
  await page.getByRole('button', { name: 'Начать' }).click();
  await expect(page.getByText(/Вопрос 1 из \d+/)).toBeVisible();
});
