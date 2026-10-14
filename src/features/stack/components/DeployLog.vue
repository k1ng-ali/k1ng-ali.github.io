<template>
  <div ref="rootEl" class="deploy" aria-hidden="true">
    <div class="deploy__cmd"><span>$</span> docker compose up -d</div>
    <ul class="deploy__steps">
      <li v-for="(s, i) in STEPS" :key="s.name" :class="stateOf(i)">
        <span class="deploy__icon">
          <i v-if="stateOf(i) === 'running'" class="deploy__spin"></i>
          <template v-else-if="stateOf(i) === 'done'">✓</template>
        </span>
        <span class="deploy__name">{{ s.name }}</span>
        <span class="deploy__info">{{ s.info }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useInView } from '@/shared/composables/useInView.ts'
import { prefersReducedMotion } from '@/shared/lib/gsap.ts'

const STEPS = [
  { name: 'db', info: 'healthy' },
  { name: 'api', info: ':8000' },
  { name: 'caddy', info: 'https ✓' },
  { name: 'release', info: 'v1.4.2' },
]

const rootEl = ref<HTMLElement | null>(null)
const inView = useInView(rootEl)

// Сколько шагов завершено; текущий — «крутится»
const done = ref(prefersReducedMotion() ? STEPS.length : 0)

function stateOf(i: number) {
  if (i < done.value) return 'done'
  if (i === done.value) return 'running'
  return 'idle'
}

let timer = 0

function tick() {
  if (done.value >= STEPS.length) {
    timer = window.setTimeout(() => { done.value = 0; tick() }, 2400)
    return
  }
  timer = window.setTimeout(() => { done.value++; tick() }, 700 + Math.random() * 500)
}

watch(inView, (v) => {
  window.clearTimeout(timer)
  if (v && !prefersReducedMotion()) tick()
})

onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<style scoped lang="scss">
.deploy {
  border-radius: 16px;
  background: #0b0b0d;
  border: 1px solid var(--line);
  padding: 0.9rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
}

.deploy__cmd {
  color: var(--text);
  margin-bottom: 0.6rem;
  white-space: nowrap;
  span { color: var(--accent); }
}

.deploy__steps {
  list-style: none;
  display: grid;
  gap: 0.35rem;

  li {
    display: grid;
    grid-template-columns: 1.2em 1fr auto;
    gap: 0.5rem;
    color: var(--dim);
    transition: color 0.3s;

    &.running { color: var(--muted); }
    &.done { color: var(--text); }
    &.done .deploy__icon { color: var(--accent); }
    &.done .deploy__info { color: #34d27b; }
  }
}

.deploy__spin {
  display: inline-block;
  width: 0.75em;
  height: 0.75em;
  border: 1.5px solid var(--muted);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
