import { createI18n } from 'vue-i18n'
import ru from './locales/ru.ts'
import tg from './locales/tg.ts'

export type AppLocale = 'ru' | 'tg'

export const LOCALES: { code: AppLocale; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'tg', label: 'TJ' },
]

const STORAGE_KEY = 'locale'

// Хранилище может быть недоступно (приватный режим) — молча падаем на ru
function readLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ru' || saved === 'tg') return saved
  } catch { /* ignore */ }
  return 'ru'
}

const initial = readLocale()
document.documentElement.lang = initial

export const i18n = createI18n({
  legacy: false,
  locale: initial,
  fallbackLocale: 'ru',
  messages: { ru, tg },
})

export function setLocale(code: AppLocale) {
  i18n.global.locale.value = code
  document.documentElement.lang = code
  try { localStorage.setItem(STORAGE_KEY, code) } catch { /* ignore */ }
}
