<template>
  <div class="hv" :data-cursor="t('work.try')">
    <div class="hv__card">
      <!-- Шапка фонда -->
      <div class="hv__top">
        <div class="hv__logo" aria-hidden="true">
          <svg viewBox="0 0 40 40"><path d="M12 12 L28 28 M28 12 L12 28" /><circle cx="31" cy="31" r="3.2" /></svg>
        </div>
        <div class="hv__fund">
          <b>Ҳашар</b>
          <span>{{ t('mock.hashar.fund') }}</span>
        </div>
        <div class="hv__avatars" aria-hidden="true">
          <i v-for="(p, i) in people" :key="p" :style="{ background: AVATAR_COLORS[i] }">{{ p[0] }}</i>
        </div>
      </div>

      <!-- Баланс и валюты -->
      <div class="hv__balance">
        <span class="hv__label">{{ t('mock.hashar.balance') }}</span>
        <div class="hv__amount">
          <b>{{ formatted }}</b><span>{{ currency }}</span>
        </div>
        <div class="hv__switch" role="group" aria-label="Currency">
          <button
            v-for="c in CURRENCIES"
            :key="c"
            :class="{ active: c === currency }"
            @click="pick(c)"
          >{{ c }}</button>
        </div>
      </div>

      <!-- Целевой сбор -->
      <div class="hv__goal">
        <div class="hv__goal-head">
          <span>{{ t('mock.hashar.goal') }}</span><b>72%</b>
        </div>
        <div class="hv__bar"><i></i></div>
      </div>

      <!-- Взносы -->
      <ul class="hv__list">
        <li v-for="(p, i) in people" :key="p">
          <i :style="{ background: AVATAR_COLORS[i] }">{{ p[0] }}</i>
          <span class="hv__name">{{ p }}</span>
          <span class="hv__sum">+{{ CONTRIBS[i] }} TJS</span>
          <span class="hv__chip" :class="{ pending: i === 1 }">
            {{ i === 1 ? t('mock.hashar.pending') : t('mock.hashar.checked') }}
          </span>
        </li>
      </ul>
    </div>

    <div class="hv__toast">
      <span class="hv__toast-icon">✓</span>
      {{ t('mock.hashar.receipt') }} · +350 TJS
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from '@/shared/lib/gsap.ts'

type Currency = 'TJS' | 'RUB' | 'USD'

const CURRENCIES: Currency[] = ['TJS', 'RUB', 'USD']
const BALANCES: Record<Currency, number> = { TJS: 48250, RUB: 412300, USD: 4420 }
const CONTRIBS = [350, 500, 200]
const AVATAR_COLORS = ['#34d27b', '#f2a65a', '#6aa8ff']

const { t, tm, rt } = useI18n()

const people = computed(() => (tm('mock.hashar.people') as string[]).map((m) => rt(m)))

const currency = ref<Currency>('TJS')
const counter = reactive({ value: BALANCES.TJS })
const formatted = computed(() => Math.round(counter.value).toLocaleString('ru-RU'))

let autoTimer = 0

function pick(c: Currency, manual = true) {
  currency.value = c
  gsap.to(counter, { value: BALANCES[c], duration: 0.9, ease: 'power3.out' })
  // Ручной выбор останавливает автопереключение
  if (manual) window.clearInterval(autoTimer)
}

onMounted(() => {
  autoTimer = window.setInterval(() => {
    const next = CURRENCIES[(CURRENCIES.indexOf(currency.value) + 1) % CURRENCIES.length]
    if (next) pick(next, false)
  }, 2600)
})

onBeforeUnmount(() => window.clearInterval(autoTimer))
</script>

<style scoped lang="scss">
.hv {
  position: relative;
  width: min(100%, 460px);
  font-family: var(--font-body);
  color: #111827;
}

/* ── Card ──────────────────────────── */
.hv__card {
  background: #f4f4f1;
  border-radius: 26px;
  padding: 22px;
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06);
  display: grid;
  gap: 14px;
}

.hv__top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hv__logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #111827;
  display: grid;
  place-items: center;

  svg { width: 30px; height: 30px; }
  path { stroke: #fff; stroke-width: 4.5; stroke-linecap: round; fill: none; }
  circle { fill: #22c55e; }
}

.hv__fund {
  display: grid;
  line-height: 1.25;
  b { font-size: 15px; }
  span { font-size: 12px; color: #6b7280; }
}

.hv__avatars {
  margin-left: auto;
  display: flex;

  i {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid #f4f4f1;
    margin-left: -8px;
    display: grid;
    place-items: center;
    font-style: normal;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
  }
}

/* ── Balance ───────────────────────── */
.hv__balance {
  background: #111827;
  color: #fff;
  border-radius: 20px;
  padding: 18px;
  display: grid;
  gap: 4px;
}

.hv__label { font-size: 12px; color: #9ca3af; }

.hv__amount {
  display: flex;
  align-items: baseline;
  gap: 8px;
  b {
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
  span { color: #22c55e; font-weight: 600; font-size: 14px; }
}

.hv__switch {
  display: flex;
  gap: 6px;
  margin-top: 8px;

  button {
    font-size: 12px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: #d1d5db;
    transition: background 0.3s, color 0.3s;

    &.active { background: #22c55e; color: #052e16; }
  }
}

/* ── Goal ──────────────────────────── */
.hv__goal {
  background: #fff;
  border-radius: 16px;
  padding: 14px 16px;
}

.hv__goal-head {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 8px;
  b { color: #16a34a; }
}

.hv__bar {
  height: 8px;
  border-radius: 99px;
  background: #e5e7eb;
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    width: 72%;
    border-radius: inherit;
    background: linear-gradient(90deg, #22c55e, #86efac);
    animation: grow 2.4s var(--ease-out) both;
  }
}

@keyframes grow { from { width: 8%; } }

/* ── List ──────────────────────────── */
.hv__list {
  list-style: none;
  background: #fff;
  border-radius: 16px;
  padding: 6px 14px;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 0;
    font-size: 13px;
    & + li { border-top: 1px solid #f0f0ee; }
  }

  i {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-style: normal;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
  }
}

.hv__name { flex: 1; font-weight: 500; }
.hv__sum { font-weight: 600; font-variant-numeric: tabular-nums; }

.hv__chip {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 99px;
  background: #dcfce7;
  color: #15803d;

  &.pending { background: #fef3c7; color: #b45309; }
}

/* ── Toast ─────────────────────────── */
.hv__toast {
  position: absolute;
  top: 34%;
  right: -9%;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 14px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.45);
  animation: bob 4s ease-in-out infinite;
}

.hv__toast-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #22c55e;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 12px;
}

@keyframes bob {
  50% { transform: translateY(-10px); }
}

@media (max-width: 600px) {
  .hv__toast { right: -2%; top: -4%; }
}
</style>
