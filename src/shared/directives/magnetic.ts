import type { Directive } from 'vue'
import { gsap, isFinePointer } from '@/shared/lib/gsap.ts'

type MagneticEl = HTMLElement & { __magnetic?: () => void }

// v-magnetic="0.4" — элемент тянется за курсором, значение = сила притяжения
export const vMagnetic: Directive<MagneticEl, number | undefined> = {
  mounted(el, binding) {
    if (!isFinePointer()) return

    const strength = binding.value ?? 0.35
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onLeave = () => { xTo(0); yTo(0) }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    el.__magnetic = () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  },
  unmounted(el) {
    el.__magnetic?.()
  },
}
