import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap.ts'

let lenis: Lenis | null = null

const raf = (time: number) => lenis?.raf(time * 1000)

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return

  lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
}

export function destroySmoothScroll() {
  gsap.ticker.remove(raf)
  lenis?.destroy()
  lenis = null
}

export function scrollToTarget(target: string) {
  if (lenis) {
    // Оверлей мог только что закрыться: lenis.start() сбрасывает текущую анимацию,
    // поэтому ждём, пока блокировка снимется
    const go = () => lenis?.scrollTo(target, { duration: 1.4, force: true })
    if (lenis.isStopped) window.setTimeout(go, 60)
    else go()
    return
  }
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

// Оверлеи (кейс, меню, палитра) замораживают страницу; могут открываться друг поверх друга
let locks = 0

export function lockScroll() {
  if (locks++ > 0) return
  lenis?.stop()
  document.documentElement.classList.add('is-locked')
}

export function unlockScroll() {
  if (locks === 0 || --locks > 0) return
  lenis?.start()
  document.documentElement.classList.remove('is-locked')
}
