import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Скроллом управляем сами: иначе «Назад» при закрытии кейса прыгает на старую позицию,
// а перезагрузка открывает страницу посередине, мимо анимации hero.
// Через ScrollTrigger — он сам переключает history.scrollRestoration при refresh
ScrollTrigger.clearScrollMemory('manual')

export { gsap, ScrollTrigger }

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Мышь/тачпад — включаем курсор, магниты и прочие hover-эффекты
export const isFinePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches
