<template>
  <div ref="rootEl" class="log" aria-hidden="true">
    <TransitionGroup tag="ul" name="log" class="log__list">
      <li v-for="row in rows" :key="row.key" class="log__row">
        <span class="log__method" :class="`m-${row.method.toLowerCase()}`">{{ row.method }}</span>
        <span class="log__path">{{ row.path }}</span>
        <span class="log__status" :class="statusClass(row.status)">{{ row.status }}</span>
        <span class="log__ms">{{ row.ms }}</span>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useInView } from '@/shared/composables/useInView.ts'
import { prefersReducedMotion } from '@/shared/lib/gsap.ts'

interface Row { key: number; method: string; path: string; status: number; ms: string }

// Запросы из реальных проектов: Ҳашар и Dovtalab
const POOL: Omit<Row, 'key'>[] = [
  { method: 'GET',   path: '/api/funds/14',              status: 200, ms: '12ms' },
  { method: 'POST',  path: '/api/contributions',         status: 201, ms: '48ms' },
  { method: 'PATCH', path: '/api/contributions/381',     status: 200, ms: '21ms' },
  { method: 'GET',   path: '/api/quizzes/today',         status: 200, ms: '9ms' },
  { method: 'WS',    path: '/duels/77',                  status: 101, ms: '—' },
  { method: 'POST',  path: '/api/auth/telegram',         status: 200, ms: '33ms' },
  { method: 'GET',   path: '/api/accounts?cur=USD',      status: 200, ms: '15ms' },
  { method: 'POST',  path: '/api/expenses',              status: 403, ms: '4ms' },
  { method: 'GET',   path: '/api/leaderboard?limit=50',  status: 200, ms: '18ms' },
]

const MAX_ROWS = 5

const rootEl = ref<HTMLElement | null>(null)
const inView = useInView(rootEl)

let seq = 0
const next = () => ({ ...POOL[seq % POOL.length]!, key: seq++ })
const rows = ref<Row[]>(Array.from({ length: MAX_ROWS }, next))

let timer = 0

function tick() {
  rows.value = [...rows.value.slice(1 - MAX_ROWS), next()]
}

function statusClass(status: number) {
  if (status >= 400) return 's-err'
  if (status === 101) return 's-ws'
  return 's-ok'
}

watch(inView, (v) => {
  window.clearInterval(timer)
  if (v && !prefersReducedMotion()) timer = window.setInterval(tick, 1100)
})

onBeforeUnmount(() => window.clearInterval(timer))
</script>

<style scoped lang="scss">
.log {
  border-radius: 16px;
  background: #0b0b0d;
  border: 1px solid var(--line);
  padding: 0.6rem 0.4rem;
  overflow: hidden;
}

.log__list {
  list-style: none;
  position: relative;
}

.log__row {
  display: grid;
  grid-template-columns: 4.2em 1fr auto 3.4em;
  gap: 0.8rem;
  align-items: center;
  padding: 0.38rem 0.7rem;
  font-family: var(--font-mono);
  font-size: clamp(0.68rem, 0.85vw, 0.78rem);
  white-space: nowrap;

  &:last-child { background: rgba(200, 255, 61, 0.05); border-radius: 8px; }
}

.log__path { color: var(--text); overflow: hidden; text-overflow: ellipsis; }
.log__ms { color: var(--dim); text-align: right; }

.m-get   { color: #82aaff; }
.m-post  { color: var(--accent); }
.m-patch { color: #f2c46d; }
.m-ws    { color: #c792ea; }

.s-ok  { color: #34d27b; }
.s-ws  { color: #c792ea; }
.s-err { color: #ff6b6b; }

.log-move, .log-enter-active, .log-leave-active { transition: all 0.5s var(--ease-out); }
.log-enter-from { opacity: 0; transform: translateY(14px); }
.log-leave-to { opacity: 0; transform: translateY(-14px); }
.log-leave-active { position: absolute; left: 0; right: 0; }
</style>
