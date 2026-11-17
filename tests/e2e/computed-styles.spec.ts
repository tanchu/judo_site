import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Эталон вычисленных стилей: дешёвая замена скриншотным тестам.
 *
 * Для каждой страницы и ширины собираем стили всех элементов шапки, `main` и
 * подвала: отступы, шрифт, сетку, цвета, рамки. Сравниваем с текстовым эталоном
 * в `tests/e2e/__snapshots__/computed-styles/`. Ловит сдвиги отступов, колонок и
 * размеров после правок классов, брейкпоинтов и Tailwind, не завися от
 * сглаживания шрифтов и ОС. Не видит чисто визуальное: картинки, тени, обрезку.
 *
 * Ширину и высоту элементов не берём: они меняются от любой правки текста.
 *  * Эталон снят в Linux, как в CI: ширина текста (и всё, что от неё зависит, например
 * `max-w-[23ch]`) на macOS чуть другая. Поэтому на macOS тест пропускается, а проверка и
 * обновление идут в контейнере Playwright (Docker):
 *   pnpm run test:styles          — проверить
 *   pnpm run test:styles:update   — намеренно поменяли вёрстку: обновить эталон и проверить diff в PR
 */

const PAGES = ['/', '/techniques', '/glossary', '/etiquette', '/about', '/quiz', '/progress'] as const;

/** Телефон, планшет, десктоп — по одной ширине внутри каждого диапазона брейкпоинтов. */
const WIDTHS = [375, 768, 1440] as const;

const PROPS = [
  'display', 'position', 'flex-direction', 'flex-wrap', 'align-items', 'justify-content',
  'grid-template-columns', 'row-gap', 'column-gap',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'max-width', 'min-height',
  'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'text-align',
  'color', 'background-color',
  'border-top-width', 'border-bottom-width', 'border-left-width', 'border-right-width', 'border-radius',
] as const;

/** Значения по умолчанию не пишем — так эталон короче и diff читается легче. */
const DEFAULTS: Record<string, string> = {
  display: 'block', position: 'static', 'flex-direction': 'row', 'flex-wrap': 'nowrap',
  'align-items': 'normal', 'justify-content': 'normal', 'grid-template-columns': 'none',
  'row-gap': 'normal', 'column-gap': 'normal', 'max-width': 'none', 'min-height': '0px',
  'letter-spacing': 'normal', 'text-transform': 'none', 'text-align': 'start',
  'background-color': 'rgba(0, 0, 0, 0)', 'border-radius': '0px',
};

async function collectStyles(page: Page): Promise<string> {
  return page.evaluate(({ props, defaults }) => {
    const seen = new Set<Element>();
    const lines: string[] = [];
    for (const root of document.querySelectorAll('body header, main, footer')) {
      for (const el of [root, ...root.querySelectorAll('*')]) {
        if (seen.has(el) || el.closest('svg') !== null) {
          continue;
        }
        seen.add(el);
        // Не отрисованное (скрытый предок, свёрнутая панель с `hidden="until-found"`) не
        // пишем: react-aria скрывает панели до и после гидратации по-разному.
        if (!el.checkVisibility()) {
          continue;
        }
        const cs = getComputedStyle(el);
        // Поле `auto` (`mx-auto`, `ml-auto`, `mt-auto`) getComputedStyle отдаёт в px, а они
        // зависят от ширины окна и от ширины текста (шрифты на Linux и macOS отрисовываются
        // чуть по-разному). Typed OM отдаёт вычисленное значение — просто «auto».
        const typed = el.computedStyleMap();
        const values = props
          .map((prop) => {
            let value = cs.getPropertyValue(prop);
            if (prop.startsWith('margin-') && typed.get(prop)?.toString() === 'auto') {
              value = 'auto';
            }
            // Ширины колонок в px зависят от ширины окна: сравниваем число колонок.
            if (prop === 'grid-template-columns' && value !== 'none') {
              value = `${value.split(' ').length.toString()} кол.`;
            }
            return defaults[prop] === value || value === '0px' ? '' : `${prop}:${value}`;
          })
          .filter(Boolean)
          .join('; ');
        const testId = el.getAttribute('data-testid');
        lines.push(`${el.tagName.toLowerCase()}${testId ? `#${testId}` : ''} ${values}`);
      }
    }
    return `${lines.join('\n')}\n`;
  }, { props: PROPS, defaults: DEFAULTS });
}

test.describe('Вычисленные стили совпадают с эталоном', () => {
  test.use({ reducedMotion: 'reduce' });
  test.skip(process.platform !== 'linux', 'Эталон снят в Linux: pnpm run test:styles (Docker)');

  for (const path of PAGES) {
    for (const width of WIDTHS) {
      test(`${path} при ${width.toString()}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        // Не `networkidle`: в CI главная не затихает (сторонние запросы) и тест ждал 30 с.
        await page.waitForLoadState('load');
        await page.evaluate(() => document.fonts.ready);
        const name = `${path.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'root'}-${width.toString()}.txt`;
        expect(await collectStyles(page)).toMatchSnapshot(name);
      });
    }
  }
});
