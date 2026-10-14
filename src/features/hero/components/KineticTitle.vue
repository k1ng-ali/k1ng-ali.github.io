<template>
  <h1 ref="rootEl" class="kinetic" :aria-label="lines.join(' ')">
    <span v-for="(line, li) in lines" :key="li" class="kinetic__line" aria-hidden="true">
      <span class="kinetic__inner">
        <span
          v-for="(ch, ci) in Array.from(line)"
          :key="ci"
          class="kinetic__char"
          :class="{ 'kinetic__char--accent': li === accentLine }"
        >{{ ch === ' ' ? ' ' : ch }}</span>
      </span>
    </span>
  </h1>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, isFinePointer, prefersReducedMotion } from '@/shared/lib/gsap.ts'

/*
 * Заголовок, у которого буквы «набухают» рядом с курсором:
 * вариативный шрифт плавно меняет вес в зависимости от расстояния.
 */

defineProps<{
  lines: string[]
  accentLine?: number
}>()

const emit = defineEmits<{
  (e: 'revealed'): void
}>()

const BASE_WEIGHT = 300
const MAX_WEIGHT = 900
const RADIUS = 220

const rootEl = ref<HTMLElement | null>(null)

let chars: HTMLElement[] = []
let centers: { x: number; y: number }[] = []
let weights: number[] = []
let mouse = { x: -9999, y: -9999 }
let rafId = 0
let active = false

// Центры букв в координатах документа — пересчитываем на resize/scroll (hero уезжает с параллаксом)
function measure() {
  const sx = window.scrollX
  const sy = window.scrollY
  centers = chars.map((c) => {
    const r = c.getBoundingClientRect()
    return { x: r.left + r.width / 2 + sx, y: r.top + r.height / 2 + sy }
  })
}

function tick() {
  const sx = window.scrollX
  const sy = window.scrollY
  for (let i = 0; i < chars.length; i++) {
    const c = centers[i]
    const el = chars[i]
    const current = weights[i]
    if (!c || !el || current === undefined) continue
    const dist = Math.hypot(c.x - sx - mouse.x, c.y - sy - mouse.y)
    const f = Math.max(0, 1 - dist / RADIUS)
    const target = BASE_WEIGHT + (MAX_WEIGHT - BASE_WEIGHT) * f * f * (3 - 2 * f)
    const next = current + (target - current) * 0.14
    if (Math.abs(next - current) > 0.5) {
      weights[i] = next
      el.style.fontWeight = String(Math.round(next))
    }
  }
  rafId = requestAnimationFrame(tick)
}

const onMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY } }

function reveal() {
  const root = rootEl.value
  if (!root) return

  if (prefersReducedMotion()) {
    emit('revealed')
    return
  }

  gsap.from(root.querySelectorAll('.kinetic__inner'), {
    yPercent: 110,
    rotate: 4,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.12,
    onComplete: () => { measure(); emit('revealed') },
  })
}

onMounted(async () => {
  if (!rootEl.value) return
  chars = Array.from(rootEl.value.querySelectorAll<HTMLElement>('.kinetic__char'))
  weights = chars.map(() => BASE_WEIGHT)

  // Ждём шрифт, иначе замеры и анимация поедут
  await document.fonts.ready
  reveal()

  if (!isFinePointer() || prefersReducedMotion()) return
  active = true
  measure()
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', measure, { passive: true })
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  if (!active) return
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('resize', measure)
  window.removeEventListener('scroll', measure)
})

defineExpose({ measure })
</script>

<style scoped lang="scss">
.kinetic {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(2.5rem, 10.4vw, 11.5rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
  text-transform: none;
}

.kinetic__line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.06em;
  white-space: nowrap;
}

.kinetic__inner {
  display: inline-block;
  transform-origin: 0 100%;
}

.kinetic__char {
  display: inline-block;
  font-weight: 300;
  &--accent { color: var(--accent); }
}
</style>
