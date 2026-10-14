<template>
  <div
    v-if="enabled"
    class="cursor"
    :class="{ 'cursor--hover': state === 'hover', 'cursor--label': state === 'label', 'cursor--hidden': hidden }"
    aria-hidden="true"
  >
    <div ref="ringEl" class="cursor__ring">
      <span class="cursor__label">{{ label }}</span>
    </div>
    <div ref="dotEl" class="cursor__dot"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, isFinePointer } from '@/shared/lib/gsap.ts'

type CursorState = 'idle' | 'hover' | 'label'

const enabled = ref(false)
const hidden = ref(true)
const state = ref<CursorState>('idle')
const label = ref('')

const ringEl = ref<HTMLElement | null>(null)
const dotEl = ref<HTMLElement | null>(null)

let ringX: gsap.QuickToFunc, ringY: gsap.QuickToFunc
let dotX: gsap.QuickToFunc, dotY: gsap.QuickToFunc

const onMove = (e: MouseEvent) => {
  hidden.value = false
  ringX(e.clientX); ringY(e.clientY)
  dotX(e.clientX);  dotY(e.clientY)
}

// Элемент с data-cursor="Текст" показывает подпись, ссылки/кнопки — увеличивают кольцо
const onOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement | null
  const labelled = target?.closest<HTMLElement>('[data-cursor]')
  if (labelled) {
    label.value = labelled.dataset.cursor ?? ''
    state.value = 'label'
    return
  }
  state.value = target?.closest('a, button') ? 'hover' : 'idle'
}

const onLeaveWindow = () => { hidden.value = true }

onMounted(async () => {
  if (!isFinePointer()) return
  enabled.value = true
  await nextTick()
  if (!ringEl.value || !dotEl.value) return

  gsap.set([ringEl.value, dotEl.value], { xPercent: -50, yPercent: -50 })
  ringX = gsap.quickTo(ringEl.value, 'x', { duration: 0.45, ease: 'power3' })
  ringY = gsap.quickTo(ringEl.value, 'y', { duration: 0.45, ease: 'power3' })
  dotX  = gsap.quickTo(dotEl.value, 'x', { duration: 0.08 })
  dotY  = gsap.quickTo(dotEl.value, 'y', { duration: 0.08 })

  document.documentElement.classList.add('has-cursor')
  window.addEventListener('mousemove', onMove)
  document.addEventListener('mouseover', onOver)
  document.documentElement.addEventListener('mouseleave', onLeaveWindow)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('has-cursor')
  window.removeEventListener('mousemove', onMove)
  document.removeEventListener('mouseover', onOver)
  document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
})
</script>

<style scoped lang="scss">
.cursor {
  position: fixed;
  inset: 0;
  z-index: 9500;
  pointer-events: none;
  transition: opacity 0.3s;

  &--hidden { opacity: 0; }
}

/* ── Ring ──────────────────────────── */
.cursor__ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.45);
  display: grid;
  place-items: center;
  transition:
    width 0.45s var(--ease-out),
    height 0.45s var(--ease-out),
    background 0.3s,
    border-color 0.3s;
}

.cursor__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent-ink);
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.25s, transform 0.4s var(--ease-out);
  white-space: nowrap;
}

/* ── Dot ───────────────────────────── */
.cursor__dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  transition: opacity 0.2s;
}

/* ── States ────────────────────────── */
.cursor--hover .cursor__ring {
  width: 64px;
  height: 64px;
  border-color: var(--accent);
  background: rgba(200, 255, 61, 0.08);
}

.cursor--label {
  .cursor__ring {
    width: 96px;
    height: 96px;
    border-color: transparent;
    background: var(--accent);
  }
  .cursor__label { opacity: 1; transform: scale(1); }
  .cursor__dot { opacity: 0; }
}
</style>
