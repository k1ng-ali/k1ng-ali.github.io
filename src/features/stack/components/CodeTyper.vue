<template>
  <div ref="rootEl" class="code" aria-hidden="true">
    <div class="code__bar">
      <span class="code__dots"><i></i><i></i><i></i></span>
      <span class="code__file">FundBalance.vue</span>
    </div>
    <pre class="code__body"><code><template v-for="(line, li) in visibleLines" :key="li"><span class="code__ln">{{ li + 1 }}</span><span v-for="(tok, ti) in line" :key="ti" :class="`t-${tok[0]}`">{{ tok[1] }}</span><span v-if="li === visibleLines.length - 1" class="code__caret"></span>
</template></code></pre>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useInView } from '@/shared/composables/useInView.ts'
import { prefersReducedMotion } from '@/shared/lib/gsap.ts'

/*
 * Код «печатается» посимвольно, пока плитка на экране; в конце — пауза и заново.
 * Токены: k — ключевое слово, f — функция, s — строка, v — переменная, p — пунктуация, c — комментарий.
 */

type Kind = 'k' | 'f' | 's' | 'v' | 'p' | 'c' | 'x'
type Token = [Kind, string]

const LINES: Token[][] = [
  [['p', '<'], ['k', 'script'], ['x', ' '], ['v', 'setup'], ['x', ' '], ['v', 'lang'], ['p', '='], ['s', '"ts"'], ['p', '>']],
  [['k', 'import'], ['p', ' { '], ['f', 'computed'], ['p', ' } '], ['k', 'from'], ['x', ' '], ['s', "'vue'"]],
  [['k', 'import'], ['p', ' { '], ['f', 'useFundStore'], ['p', ' } '], ['k', 'from'], ['x', ' '], ['s', "'./store'"]],
  [],
  [['c', '// Баланс в выбранной валюте']],
  [['k', 'const'], ['x', ' '], ['v', 'fund'], ['p', ' = '], ['f', 'useFundStore'], ['p', '()']],
  [['k', 'const'], ['x', ' '], ['v', 'balance'], ['p', ' = '], ['f', 'computed'], ['p', '(() =>']],
  [['x', '  '], ['v', 'fund'], ['p', '.'], ['f', 'convert'], ['p', '('], ['v', 'fund'], ['p', '.'], ['v', 'total'], ['p', ', '], ['s', "'TJS'"], ['p', '))']],
  [['p', '</'], ['k', 'script'], ['p', '>']],
]

const SPEED = 26        // мс на символ
const PAUSE = 2600      // пауза перед повтором

const rootEl = ref<HTMLElement | null>(null)
const inView = useInView(rootEl)

const totalChars = LINES.reduce((sum, line) => sum + line.reduce((s, t) => s + t[1].length, 0) + 1, 0)
const typed = ref(prefersReducedMotion() ? totalChars : 0)

// Обрезаем токены по количеству напечатанных символов
const visibleLines = computed(() => {
  let left = typed.value
  const out: Token[][] = []
  for (const line of LINES) {
    if (left <= 0) break
    const cur: Token[] = []
    for (const [kind, text] of line) {
      if (left <= 0) break
      cur.push([kind, text.slice(0, left)])
      left -= text.length
    }
    left -= 1 // перевод строки
    out.push(cur)
  }
  return out
})

let timer = 0

function step() {
  if (typed.value >= totalChars) {
    timer = window.setTimeout(() => { typed.value = 0; step() }, PAUSE)
    return
  }
  typed.value++
  timer = window.setTimeout(step, SPEED)
}

watch(inView, (v) => {
  window.clearTimeout(timer)
  if (v && !prefersReducedMotion()) step()
})

onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<style scoped lang="scss">
.code {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #0b0b0d;
  border: 1px solid var(--line);
  overflow: hidden;
  min-height: 300px;
}

.code__bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid var(--line);
}

.code__dots {
  display: flex;
  gap: 6px;
  i { width: 9px; height: 9px; border-radius: 50%; background: #2c2c30; }
}

.code__file {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--muted);
}

.code__body {
  padding: 1rem 1.1rem;
  font-family: var(--font-mono);
  font-size: clamp(0.72rem, 0.95vw, 0.85rem);
  line-height: 1.75;
  color: var(--text);
  white-space: pre;
  overflow: hidden;
}

.code__ln {
  display: inline-block;
  width: 2.2em;
  color: var(--dim);
  user-select: none;
}

.code__caret {
  display: inline-block;
  width: 0.55em;
  height: 1.1em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--accent);
  animation: caret 1s steps(1) infinite;
}

@keyframes caret { 50% { opacity: 0; } }

.t-k { color: #c792ea; }
.t-f { color: #82aaff; }
.t-s { color: var(--accent); }
.t-v { color: #f2f2ee; }
.t-p { color: #89ddff; }
.t-c { color: #5c6370; font-style: italic; }
</style>
