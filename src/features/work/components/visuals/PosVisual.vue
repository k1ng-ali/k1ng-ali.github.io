<template>
  <div class="pv" :data-cursor="t('work.try')">
    <div class="pv__head">
      <span class="pv__brand"><i>☕</i> CoffeePOS</span>
      <span class="pv__shift">{{ t('mock.pos.shift') }}</span>
      <span class="pv__offline"><i></i>offline</span>
    </div>

    <div class="pv__body">
      <!-- Каталог -->
      <div class="pv__grid">
        <button v-for="(name, i) in items" :key="name" class="pv__tile" @click="add(i)">
          <span class="pv__emoji">{{ EMOJI[i] }}</span>
          <span class="pv__tname">{{ name }}</span>
          <span class="pv__price">{{ price(i) }} {{ t('mock.pos.currency') }}</span>
        </button>
      </div>

      <!-- Чек -->
      <div class="pv__receipt">
        <TransitionGroup v-if="lines.length" tag="ul" name="pv-line" class="pv__lines">
          <li v-for="line in lines" :key="line.idx" @click="remove(line.idx)">
            <span>{{ items[line.idx] }}</span>
            <span class="pv__qty">×{{ line.qty }}</span>
            <b>{{ line.qty * price(line.idx) }}</b>
          </li>
        </TransitionGroup>
        <p v-else class="pv__empty">{{ t('mock.pos.empty') }}</p>

        <div class="pv__total">
          <span>{{ t('mock.pos.total') }}</span>
          <b :key="total" class="pv__sum">{{ total }} {{ t('mock.pos.currency') }}</b>
        </div>
        <div class="pv__lock">🔒 {{ t('mock.pos.encrypted') }} · AES-GCM</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Line { idx: number; qty: number }

const PRICES = [28, 26, 20, 18, 30, 32]
const EMOJI = ['🥛', '☕', '🫖', '🥐', '🍮', '🍰']

const { t, tm, rt } = useI18n()

const items = computed(() => (tm('mock.pos.items') as string[]).map((m) => rt(m)))

// Пара позиций сразу, чтобы чек не был пустым
const lines = ref<Line[]>([{ idx: 0, qty: 2 }, { idx: 3, qty: 1 }])

const total = computed(() => lines.value.reduce((sum, l) => sum + l.qty * price(l.idx), 0))

function price(idx: number) {
  return PRICES[idx] ?? 0
}

function add(idx: number) {
  const line = lines.value.find((l) => l.idx === idx)
  if (line) line.qty++
  else lines.value.push({ idx, qty: 1 })
}

function remove(idx: number) {
  lines.value = lines.value.filter((l) => l.idx !== idx)
}
</script>

<style scoped lang="scss">
.pv {
  width: min(100%, 580px);
  background: #12151c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 18px;
  font-family: var(--font-body);
  color: #e2e8f0;
  box-shadow: 0 40px 90px -20px rgba(0, 0, 0, 0.75), 0 0 90px -30px rgba(242, 196, 109, 0.35);
}

/* ── Head ──────────────────────────── */
.pv__head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 12px;
}

.pv__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;

  i {
    font-style: normal;
    width: 28px;
    height: 28px;
    border-radius: 9px;
    display: grid;
    place-items: center;
    background: rgba(242, 196, 109, 0.14);
  }
}

.pv__shift { color: #94a3b8; font-family: var(--font-mono); }

.pv__offline {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  color: #f2c46d;

  i { width: 6px; height: 6px; border-radius: 50%; background: #f2c46d; }
}

/* ── Body ──────────────────────────── */
.pv__body {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 14px;
}

.pv__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.pv__tile {
  display: grid;
  justify-items: start;
  gap: 2px;
  padding: 12px;
  border-radius: 14px;
  background: #1a1e27;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: left;
  transition: border-color 0.2s, transform 0.15s, background 0.2s;

  &:hover { border-color: rgba(242, 196, 109, 0.5); background: #1f2430; }
  &:active { transform: scale(0.95); }
}

.pv__emoji { font-size: 18px; margin-bottom: 4px; }
.pv__tname { font-size: 13px; font-weight: 600; }
.pv__price { font-size: 11px; color: #f2c46d; font-family: var(--font-mono); }

/* ── Receipt ───────────────────────── */
.pv__receipt {
  display: flex;
  flex-direction: column;
  background: #0d0f14;
  border-radius: 16px;
  padding: 14px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  font-size: 12px;
  min-height: 0;
}

.pv__lines {
  list-style: none;
  display: grid;
  gap: 6px;
  max-height: 170px;
  overflow: hidden;

  li {
    display: grid;
    grid-template-columns: 1fr auto 44px;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 8px;
    transition: background 0.2s;
    &:hover { background: rgba(239, 68, 68, 0.12); }
  }

  b { text-align: right; font-family: var(--font-mono); font-weight: 500; }
}

.pv__qty { color: #64748b; font-family: var(--font-mono); }

.pv__empty { color: #64748b; padding: 8px; }

.pv__total {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px dashed rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 13px;
}

.pv__sum {
  font-size: 20px;
  color: #f2c46d;
  font-family: var(--font-mono);
  animation: pop 0.35s var(--ease-out);
}

@keyframes pop { from { transform: scale(1.25); } }

.pv__lock {
  margin-top: 10px;
  font-size: 10.5px;
  color: #94a3b8;
  font-family: var(--font-mono);
}

.pv-line-enter-active, .pv-line-leave-active { transition: all 0.3s var(--ease-out); }
.pv-line-enter-from, .pv-line-leave-to { opacity: 0; transform: translateX(16px); }

@media (max-width: 560px) {
  .pv__body { grid-template-columns: 1fr; }
  .pv__grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
