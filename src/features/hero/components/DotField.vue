<template>
  <canvas ref="canvasEl" class="dot-field" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/shared/lib/gsap.ts'

/*
 * Поле точек на canvas: точки отталкиваются от курсора и пружинят обратно,
 * клик пускает волну. Цикл крутится только пока поле видно.
 */

interface Dot { x: number; y: number; ox: number; oy: number; vx: number; vy: number }
interface Ripple { x: number; y: number; born: number }

const SPACING = 28
const RADIUS = 170          // радиус влияния курсора
const RIPPLE_SPEED = 0.9    // px/ms
const RIPPLE_LIFE = 1600    // ms
const ACCENT = [200, 255, 61]

const canvasEl = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let dots: Dot[] = []
let ripples: Ripple[] = []
let width = 0
let height = 0
let mouse = { x: -9999, y: -9999 }
let rafId = 0
let visible = false
let reduced = false
let observer: IntersectionObserver | null = null

function build() {
  const canvas = canvasEl.value
  if (!canvas) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = canvas.clientWidth
  height = canvas.clientHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx = canvas.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

  dots = []
  const offX = (width % SPACING) / 2
  const offY = (height % SPACING) / 2
  for (let y = offY; y <= height; y += SPACING) {
    for (let x = offX; x <= width; x += SPACING) {
      dots.push({ x, y, ox: 0, oy: 0, vx: 0, vy: 0 })
    }
  }
  if (reduced) draw(0)
}

function draw(now: number) {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  ripples = ripples.filter((r) => now - r.born < RIPPLE_LIFE)

  for (const d of dots) {
    let glow = 0

    if (!reduced) {
      // ── Отталкивание от курсора
      const dx = d.x + d.ox - mouse.x
      const dy = d.y + d.oy - mouse.y
      const dist = Math.hypot(dx, dy)
      if (dist < RADIUS && dist > 0.1) {
        const f = (1 - dist / RADIUS) ** 2
        d.vx += (dx / dist) * f * 1.8
        d.vy += (dy / dist) * f * 1.8
        glow = Math.max(glow, f)
      }

      // ── Волны от кликов
      for (const r of ripples) {
        const age = now - r.born
        const front = age * RIPPLE_SPEED
        const rx = d.x - r.x
        const ry = d.y - r.y
        const rd = Math.hypot(rx, ry)
        const delta = Math.abs(rd - front)
        if (delta < 46 && rd > 0.1) {
          const f = (1 - delta / 46) * (1 - age / RIPPLE_LIFE)
          d.vx += (rx / rd) * f * 1.4
          d.vy += (ry / rd) * f * 1.4
          glow = Math.max(glow, f)
        }
      }

      // ── Пружина к исходной позиции
      d.vx += -d.ox * 0.06
      d.vy += -d.oy * 0.06
      d.vx *= 0.84
      d.vy *= 0.84
      d.ox += d.vx
      d.oy += d.vy
    }

    // Лёгкая «дыхательная» волна по диагонали
    const ambient = reduced ? 0 : (Math.sin(d.x * 0.012 + d.y * 0.008 - now * 0.0012) + 1) * 0.06
    const size = 1.1 + glow * 1.8
    if (glow > 0.05) {
      ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${0.25 + glow * 0.75})`
    } else {
      ctx.fillStyle = `rgba(255,255,255,${0.16 + ambient})`
    }
    ctx.fillRect(d.x + d.ox - size / 2, d.y + d.oy - size / 2, size, size)
  }
}

function loop(now: number) {
  draw(now)
  rafId = visible ? requestAnimationFrame(loop) : 0
}

function start() {
  if (!rafId && !reduced) rafId = requestAnimationFrame(loop)
}

// Публичный метод — волна из точки в координатах окна
function ripple(clientX: number, clientY: number) {
  const rect = canvasEl.value?.getBoundingClientRect()
  if (!rect || reduced) return
  ripples.push({ x: clientX - rect.left, y: clientY - rect.top, born: performance.now() })
}

const onMove = (e: PointerEvent) => {
  const rect = canvasEl.value?.getBoundingClientRect()
  if (!rect) return
  mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

const onDown = (e: PointerEvent) => {
  const target = e.target as HTMLElement | null
  if (target?.closest('a, button')) return
  const rect = canvasEl.value?.getBoundingClientRect()
  if (!rect || e.clientY > rect.bottom || e.clientY < rect.top) return
  ripple(e.clientX, e.clientY)
}

const onLeave = () => { mouse = { x: -9999, y: -9999 } }

onMounted(() => {
  reduced = prefersReducedMotion()
  build()

  observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    if (visible) start()
  })
  if (canvasEl.value) observer.observe(canvasEl.value)

  window.addEventListener('resize', build)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown)
  document.documentElement.addEventListener('mouseleave', onLeave)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  observer?.disconnect()
  window.removeEventListener('resize', build)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerdown', onDown)
  document.documentElement.removeEventListener('mouseleave', onLeave)
})

defineExpose({ ripple })
</script>

<style scoped lang="scss">
.dot-field {
  display: block;
  width: 100%;
  height: 100%;
  -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 45%, #000 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 85% 75% at 50% 45%, #000 40%, transparent 100%);
}
</style>
