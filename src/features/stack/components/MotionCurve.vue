<template>
  <div ref="rootEl" class="curve" aria-hidden="true">
    <svg :viewBox="`0 0 ${W} ${H}`" class="curve__svg">
      <line :x1="PAD" :y1="H - PAD" :x2="W - PAD" :y2="H - PAD" class="curve__axis" />
      <line :x1="PAD" :y1="PAD" :x2="PAD" :y2="H - PAD" class="curve__axis" />
      <path :d="path" class="curve__path" />
      <circle :cx="dot.x" :cy="dot.y" r="6" class="curve__dot" />
    </svg>
    <div class="curve__track">
      <div class="curve__block" :style="{ transform: `translateX(${progress * 100}%)` }"></div>
    </div>
    <span class="curve__ease mono">ease: expo.inOut</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { gsap, prefersReducedMotion } from '@/shared/lib/gsap.ts'
import { useInView } from '@/shared/composables/useInView.ts'

/*
 * График функции плавности: точка бежит по кривой, блок снизу едет с той же easing.
 * Наглядно показывает, чем моушн отличается от линейной анимации.
 */

const W = 320
const H = 170
const PAD = 14
const ease = gsap.parseEase('expo.inOut')

const toPoint = (t: number) => ({
  x: PAD + t * (W - PAD * 2),
  y: H - PAD - ease(t) * (H - PAD * 2),
})

const path = Array.from({ length: 61 }, (_, i) => {
  const p = toPoint(i / 60)
  return `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
}).join(' ')

const rootEl = ref<HTMLElement | null>(null)
const inView = useInView(rootEl)

const state = { t: 0 }
const t = ref(0)
const dot = computed(() => toPoint(t.value))
const progress = computed(() => ease(t.value))

let tween: gsap.core.Tween | null = null

watch(inView, (v) => {
  if (prefersReducedMotion()) return
  if (!v) { tween?.pause(); return }
  if (tween) { tween.resume(); return }
  tween = gsap.to(state, {
    t: 1,
    duration: 1.8,
    ease: 'none',
    repeat: -1,
    yoyo: true,
    repeatDelay: 0.5,
    onUpdate: () => { t.value = state.t },
  })
})

onBeforeUnmount(() => tween?.kill())
</script>

<style scoped lang="scss">
.curve {
  position: relative;
  display: grid;
  gap: 0.8rem;
}

.curve__svg {
  width: 100%;
  max-height: 170px;
}

.curve__axis { stroke: var(--line-strong); stroke-width: 1; }

.curve__path {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2;
  stroke-linecap: round;
}

.curve__dot {
  fill: var(--bg);
  stroke: var(--accent);
  stroke-width: 3;
}

.curve__track {
  position: relative;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line);
  padding: 3px;
}

.curve__block {
  width: calc(100% - 44px);
  height: 100%;

  &::before {
    content: '';
    display: block;
    width: 44px;
    height: 100%;
    border-radius: 999px;
    background: var(--accent);
  }
}

.curve__ease {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.65rem;
  color: var(--dim);
  text-transform: none;
}
</style>
