import { getRequestConfig } from 'next-intl/server';

/**
 * Языки сайта ещё не выбраны (бриф, стр. 2, вопрос 2), поэтому пока один язык без префикса
 * в адресах. Строки интерфейса — в `messages/ru.json`; при добавлении второго языка сюда
 * подключается маршрутизация next-intl (`[locale]`).
 */
export const LOCALE = 'ru';

export default getRequestConfig(async () => ({
  locale: LOCALE,
  messages: (await import(`../../messages/${LOCALE}.json`)).default,
}));
