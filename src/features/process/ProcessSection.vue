<template>
  <section id="process" ref="sectionEl" class="process">
    <div class="process__side">
      <SectionHead
        stacked
        :index="t('process.index')"
        :label="t('process.label')"
        :title="t('process.title')"
        :lead="t('process.lead')"
      />
    </div>

    <ol ref="listEl" class="steps">
      <!-- Линия, которая прорисовывается при скролле -->
      <span class="steps__line" aria-hidden="true"><i ref="lineEl"></i></span>

      <li v-for="(n, i) in 4" :key="n" class="step" :class="{ 'step--active': i <= active }">
        <span class="step__num">{{ String(n).padStart(2, '0') }}</span>
        <div class="step__body">
          <div class="step__head">
            <h3 class="step__title">{{ t(`process.s${n}.title`) }}</h3>
            <span class="step__time mono">{{ t(`process.s${n}.time`) }}</span>
          </div>
          <p class="step__text">{{ t(`process.s${n}.text`) }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/shared/lib/gsap.ts'
import SectionHead from '@/shared/ui/SectionHead.vue'

const { t } = useI18n()

const sectionEl = ref<HTMLElement | null>(null)
const listEl = ref<HTMLElement | null>(null)
const lineEl = ref<HTMLElement | null>(null)

// Индекс последнего «пройденного» шага
const active = ref(prefersReducedMotion() ? 3 : -1)

let ctx: gsap.Context | null = null

onMounted(() => {
  if (prefersReducedMotion() || !sectionEl.value) return

  ctx = gsap.context(() => {
    gsap.fromTo(lineEl.value, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: listEl.value, start: 'top 60%', end: 'bottom 60%', scrub: true },
    })

    gsap.utils.toArray<HTMLElement>('.step').forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 60%',
        onEnter: () => { active.value = Math.max(active.value, i) },
        onLeaveBack: () => { active.value = i - 1 },
      })
      gsap.from(step.querySelector('.step__body'), {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: step, start: 'top 80%' },
      })
    })
  }, sectionEl.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<style scoped lang="scss">
.process {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(2.5rem, 6vw, 7rem);
  padding: clamp(5rem, 12vw, 10rem) var(--gutter);
  border-top: 1px solid var(--line);
}

.process__side {
  align-self: start;
  position: sticky;
  top: calc(var(--header-h) + 2rem);

  // В две колонки общий размер заголовка не помещается
  :deep(.shead__title) { font-size: clamp(3.2rem, 7.4vw, 8rem); }
}

/* ── Steps ─────────────────────────── */
.steps {
  position: relative;
  list-style: none;
  display: grid;
  gap: clamp(2.5rem, 6vh, 4.5rem);
  padding: 1rem 0;
}

.steps__line {
  position: absolute;
  left: 1.6rem;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--line-strong);

  i {
    display: block;
    height: 100%;
    background: var(--accent);
    transform-origin: top;
  }
}

.step {
  position: relative;
  display: grid;
  grid-template-columns: 3.2rem 1fr;
  gap: clamp(1.25rem, 3vw, 2.5rem);
}

.step__num {
  position: relative;
  z-index: 1;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--bg);
  border: 1px solid var(--line-strong);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--muted);
  transition: background 0.5s var(--ease-out), color 0.5s, border-color 0.5s, transform 0.5s var(--ease-out);
}

.step--active .step__num {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-ink);
  transform: scale(1.08);
}

.step__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 0.55rem 0 0.6rem;
}

.step__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.6rem, 3vw, 2.6rem);
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--muted);
  transition: color 0.5s;

  .step--active & { color: var(--text); }
}

.step__time {
  padding: 0.35em 0.8em;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  color: var(--muted);
  font-size: 0.68rem;
}

.step__text {
  color: var(--muted);
  max-width: 46ch;
}

@media (max-width: 1023px) {
  .process { grid-template-columns: 1fr; }
  .process__side { position: static; }
}
</style>
