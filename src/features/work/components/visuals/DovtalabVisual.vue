<template>
  <div class="dv" :data-cursor="t('work.try')">
    <div class="dv__phone">
      <div class="dv__notch"></div>
      <div class="dv__screen">
        <!-- Дуэль: счёт и таймер -->
        <div class="dv__duel">
          <div class="dv__player">
            <i class="dv__ava dv__ava--you">{{ t('mock.dovtalab.you')[0] }}</i>
            <span>{{ t('mock.dovtalab.you') }}</span>
          </div>
          <div class="dv__score">
            <small>⚔ {{ t('mock.dovtalab.duel') }}</small>
            <b>{{ score }} : 2</b>
          </div>
          <div class="dv__player dv__player--right">
            <i class="dv__ava">А</i>
            <span>Азиз</span>
          </div>
        </div>
        <div class="dv__timer"><i :key="round"></i></div>

        <!-- Вопрос -->
        <div class="dv__question">
          <span class="dv__qnum">4 / 10</span>
          <p>{{ t('mock.dovtalab.question') }}</p>
        </div>

        <div class="dv__answers">
          <button
            v-for="(a, i) in answers"
            :key="a"
            class="dv__answer"
            :class="answerClass(i)"
            :disabled="picked !== null"
            @click="pick(i)"
          >
            <span class="dv__letter">{{ LETTERS[i] }}</span>{{ a }}
          </button>
        </div>

        <Transition name="dv-fade">
          <div v-if="picked !== null" class="dv__feedback" :class="{ ok: picked === CORRECT }">
            <span>{{ picked === CORRECT ? t('mock.dovtalab.correct') : t('mock.dovtalab.wrong') }}</span>
            <button @click="reset">{{ t('mock.dovtalab.again') }} ↻</button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const LETTERS = ['A', 'B', 'C', 'D']
const CORRECT = 1

const { t, tm, rt } = useI18n()

const answers = computed(() => (tm('mock.dovtalab.answers') as string[]).map((m) => rt(m)))

const picked = ref<number | null>(null)
const score = ref(3)
const round = ref(0)

function pick(i: number) {
  picked.value = i
  if (i === CORRECT) score.value++
}

function reset() {
  picked.value = null
  round.value++
}

function answerClass(i: number) {
  if (picked.value === null) return ''
  if (i === CORRECT) return 'dv__answer--ok'
  if (i === picked.value) return 'dv__answer--bad'
  return 'dv__answer--dim'
}
</script>

<style scoped lang="scss">
.dv {
  display: grid;
  place-items: center;
  font-family: var(--font-body);
}

/* ── Phone ─────────────────────────── */
.dv__phone {
  position: relative;
  width: 300px;
  height: 610px;
  border-radius: 48px;
  padding: 12px;
  background: #0d0d0f;
  box-shadow:
    0 0 0 1.5px rgba(255, 255, 255, 0.12),
    0 50px 100px -20px rgba(0, 0, 0, 0.7),
    0 0 80px -10px rgba(78, 190, 194, 0.25);
}

.dv__notch {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 26px;
  border-radius: 20px;
  background: #0d0d0f;
  z-index: 2;
}

.dv__screen {
  position: relative;
  height: 100%;
  border-radius: 37px;
  overflow: hidden;
  padding: 56px 16px 16px;
  background:
    radial-gradient(circle at 85% 10%, rgba(78, 190, 194, 0.35), transparent 50%),
    linear-gradient(180deg, #eef8fa 0%, #f7fbfc 100%);
  color: #234970;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Duel header ───────────────────── */
.dv__duel {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dv__player {
  display: grid;
  justify-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  width: 60px;
}

.dv__ava {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-style: normal;
  font-weight: 700;
  color: #fff;
  background: #f2a65a;
  &--you { background: linear-gradient(135deg, #4ebec2, #234970); }
}

.dv__score {
  text-align: center;
  small { display: block; font-size: 10px; color: #6b7280; font-weight: 600; }
  b { font-size: 24px; letter-spacing: -0.02em; }
}

.dv__timer {
  height: 5px;
  border-radius: 99px;
  background: rgba(35, 73, 112, 0.1);
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #4ebec2, #234970);
    animation: timer 12s linear infinite;
  }
}

@keyframes timer {
  from { width: 100%; }
  to   { width: 0; }
}

/* ── Question ──────────────────────── */
.dv__question {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #fff;
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);

  p { font-size: 15px; font-weight: 700; line-height: 1.35; }
}

.dv__qnum { font-size: 10px; font-weight: 700; color: #4ebec2; }

/* ── Answers ───────────────────────── */
.dv__answers {
  display: grid;
  gap: 8px;
}

.dv__answer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 14px;
  background: #fff;
  border: 1.5px solid #e5edf2;
  color: #234970;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  transition: all 0.25s ease;

  &:not(:disabled):hover { border-color: #4ebec2; transform: translateX(3px); }
  &:active { transform: scale(0.97); }

  &--ok  { background: #10b981; border-color: #10b981; color: #fff; }
  &--bad { background: #ef4444; border-color: #ef4444; color: #fff; }
  &--dim { opacity: 0.45; }
}

.dv__letter {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: rgba(35, 73, 112, 0.08);
  font-size: 11px;

  .dv__answer--ok &, .dv__answer--bad & { background: rgba(255, 255, 255, 0.25); }
}

/* ── Feedback ──────────────────────── */
.dv__feedback {
  margin-top: auto;
  display: grid;
  gap: 8px;
  padding: 12px;
  border-radius: 16px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 600;
  text-align: center;

  &.ok { background: #d1fae5; color: #047857; }

  button {
    padding: 9px;
    border-radius: 30px;
    background: linear-gradient(135deg, #4ebec2, #234970);
    color: #fff;
    font-weight: 600;
    font-size: 12px;
  }
}

.dv-fade-enter-active, .dv-fade-leave-active { transition: all 0.35s var(--ease-out); }
.dv-fade-enter-from, .dv-fade-leave-to { opacity: 0; transform: translateY(12px); }

@media (max-height: 820px) and (min-width: 1024px) {
  .dv__phone { transform: scale(0.86); }
}
</style>
