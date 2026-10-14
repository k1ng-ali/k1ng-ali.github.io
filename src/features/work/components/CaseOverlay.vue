<template>
  <Transition name="cov" @after-enter="revealContent">
    <div
      v-if="project"
      ref="overlayEl"
      class="cov"
      :style="{ '--case-accent': project.accent, '--case-tint': project.tint }"
      role="dialog"
      aria-modal="true"
      :aria-label="t(`${key}.name`)"
      data-lenis-prevent
    >
      <button ref="closeEl" v-magnetic="0.3" class="cov__close" @click="closeCase">
        <span class="mono">{{ t('case.close') }}</span><i aria-hidden="true">✕</i>
      </button>

      <div :key="project.id" class="cov__page">
        <!-- 1. Шапка кейса -->
        <header class="cov__hero">
          <span class="mono cov__meta cov-reveal">
            <b>{{ pad(index + 1) }}</b> / {{ pad(PROJECTS.length) }} · {{ project.year }} · {{ t(`${key}.role`) }}
          </span>
          <h2 class="cov__name"><span class="cov__mask"><span class="cov__name-inner">{{ t(`${key}.name`) }}</span></span></h2>
          <p class="cov__tagline cov-reveal">{{ t(`${key}.tagline`) }}</p>
          <div class="cov__links cov-reveal">
            <a v-if="project.live" :href="project.live" target="_blank" rel="noopener" class="btn cov__live">{{ t('work.live') }} ↗</a>
            <a :href="project.repo" target="_blank" rel="noopener" class="btn btn--ghost">{{ t('work.repo') }} ↗</a>
          </div>
        </header>

        <!-- 2. Живой макет -->
        <div class="cov__stage cov-reveal">
          <ProjectVisual :project="project" />
        </div>

        <!-- 3. Задача / решение -->
        <div class="cov__story">
          <section class="cov-reveal">
            <h3 class="mono cov__h">{{ t('case.task') }}</h3>
            <p class="cov__lead">{{ t(`${key}.task`) }}</p>
          </section>
          <section class="cov-reveal">
            <h3 class="mono cov__h">{{ t('case.solution') }}</h3>
            <p class="cov__lead">{{ t(`${key}.solution`) }}</p>
          </section>
        </div>

        <!-- 4. Что внутри -->
        <section class="cov__block">
          <h3 class="mono cov__h cov-reveal">{{ t('case.features') }}</h3>
          <ol class="cov__features">
            <li v-for="n in 4" :key="n" class="cov-reveal">
              <span class="mono">{{ pad(n) }}</span>
              <p>{{ t(`${key}.f${n}`) }}</p>
            </li>
          </ol>
        </section>

        <!-- 5. Настоящие экраны -->
        <div class="cov__shots cov-reveal">
          <div class="cov__desktop">
            <img :src="asset(project.shots.desktop)" :alt="t(`${key}.name`)" loading="lazy" width="1440" height="900" />
          </div>
          <div class="cov__mobile">
            <img :src="asset(project.shots.mobile)" :alt="t(`${key}.name`)" loading="lazy" width="780" height="1688" />
          </div>
        </div>

        <!-- 6. Архитектура -->
        <section class="cov__block cov__arch">
          <h3 class="mono cov__h cov-reveal">{{ t('case.arch') }}</h3>
          <div class="cov-reveal">
            <p class="cov__lead">{{ t(`${key}.arch`) }}</p>
            <div class="cov__stack">
              <span v-for="s in project.stack" :key="s">{{ s }}</span>
            </div>
          </div>
        </section>

        <!-- 7. Следующий проект -->
        <button v-if="nextProject" class="cov__next" :data-cursor="t('work.open')" @click="goNext">
          <span class="mono">{{ t('case.next') }}</span>
          <span class="cov__next-name" :style="{ color: nextProject.accent }">{{ t(`work.items.${nextProject.id}.name`) }} →</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, prefersReducedMotion } from '@/shared/lib/gsap.ts'
import { lockScroll, unlockScroll } from '@/shared/lib/smoothScroll.ts'
import { vMagnetic } from '@/shared/directives/magnetic.ts'
import { asset } from '@/shared/lib/asset.ts'
import { PROJECTS } from '../data.ts'
import { syncCaseWithHistory, useCaseView } from '../composables/useCaseView.ts'
import ProjectVisual from './ProjectVisual.vue'

const { t } = useI18n()
const { project, index, nextProject, openCase, closeCase } = useCaseView()

const overlayEl = ref<HTMLElement | null>(null)
const closeEl = ref<HTMLElement | null>(null)

const key = computed(() => `work.items.${project.value?.id}`)
const pad = (n: number) => String(n).padStart(2, '0')

let lastFocus: HTMLElement | null = null
let ctx: gsap.Context | null = null

// Контент появляется после того, как панель въехала
function revealContent() {
  closeEl.value?.focus({ preventScroll: true })
  if (prefersReducedMotion() || !overlayEl.value) return
  ctx?.revert()
  ctx = gsap.context(() => {
    gsap.from('.cov__name-inner', { yPercent: 105, duration: 1.1, ease: 'expo.out' })
    gsap.utils.toArray<HTMLElement>('.cov-reveal').forEach((el) => {
      gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, scroller: overlayEl.value, start: 'top 92%' },
      })
    })
  }, overlayEl.value)
}

async function goNext() {
  if (!nextProject.value) return
  openCase(nextProject.value.id)
  await nextTick()
  overlayEl.value?.scrollTo({ top: 0 })
  revealContent()
}

watch(project, (p, prev) => {
  if (p && !prev) {
    lastFocus = document.activeElement as HTMLElement | null
    lockScroll()
  }
  if (!p && prev) {
    ctx?.revert()
    ctx = null
    unlockScroll()
    lastFocus?.focus({ preventScroll: true })
  }
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && project.value) closeCase()
}

let stopSync: (() => void) | null = null

onMounted(() => {
  stopSync = syncCaseWithHistory()
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  stopSync?.()
  ctx?.revert()
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped lang="scss">
.cov {
  position: fixed;
  inset: 0;
  z-index: 500;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--case-tint);
}

.cov-enter-active, .cov-leave-active { transition: transform 0.9s var(--ease-out), opacity 0.6s; }
.cov-enter-from { transform: translateY(100%); }
.cov-leave-to { transform: translateY(-6%); opacity: 0; }

/* ── Close ─────────────────────────── */
.cov__close {
  position: fixed;
  top: 1.25rem;
  right: var(--gutter);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.5rem 0.5rem 1.1rem;
  border-radius: 999px;
  background: rgba(10, 10, 11, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--line-strong);

  i {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-style: normal;
    background: var(--case-accent);
    color: #0a0a0b;
    transition: transform 0.4s var(--ease-out);
  }

  &:hover i { transform: rotate(90deg); }
}

/* ── Page ──────────────────────────── */
.cov__page {
  padding: clamp(6rem, 12vh, 8rem) var(--gutter) 0;
  display: grid;
  gap: clamp(4rem, 9vw, 8rem);
}

.cov__hero {
  display: grid;
  gap: 1.25rem;
}

.cov__meta {
  color: var(--muted);
  b { color: var(--case-accent); font-weight: 500; }
}

.cov__name {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(3.5rem, 13vw, 13rem);
  line-height: 0.88;
  letter-spacing: -0.06em;
}

.cov__mask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.06em;
}

.cov__name-inner { display: inline-block; }

.cov__tagline {
  font-size: clamp(1.2rem, 2.4vw, 2rem);
  color: var(--case-accent);
  max-width: 28ch;
  line-height: 1.25;
}

.cov__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.cov__live {
  background: var(--case-accent);
  color: #0a0a0b;
  &:hover { background: #fff; }
}

/* ── Stage ─────────────────────────── */
.cov__stage {
  display: grid;
  place-items: center;
  padding: clamp(2.5rem, 6vw, 5rem) clamp(1rem, 4vw, 3rem);
  border-radius: 32px;
  background:
    radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--case-accent) 18%, transparent), transparent 70%),
    rgba(255, 255, 255, 0.02);
  border: 1px solid var(--line);
}

/* ── Story ─────────────────────────── */
.cov__story {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2rem, 5vw, 5rem);
}

.cov__h {
  color: var(--case-accent);
  font-weight: 500;
  margin-bottom: 1rem;
}

.cov__lead {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.25rem, 2.2vw, 1.9rem);
  line-height: 1.3;
  letter-spacing: -0.03em;
}

/* ── Features ──────────────────────── */
.cov__features {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--line);

  li {
    display: grid;
    grid-template-columns: 3rem 1fr;
    gap: 1rem;
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--line);
    font-size: clamp(1rem, 1.4vw, 1.2rem);

    &:nth-child(odd) { padding-right: 2rem; }
    &:nth-child(even) { padding-left: 2rem; border-left: 1px solid var(--line); }

    span { color: var(--case-accent); padding-top: 0.25em; }
  }
}

/* ── Shots ─────────────────────────── */
.cov__shots {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
  gap: clamp(1rem, 2.5vw, 2rem);
  align-items: end;

  img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
}

.cov__desktop {
  aspect-ratio: 16 / 10;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--line-strong);
}

.cov__mobile {
  aspect-ratio: 390 / 844;
  border-radius: 28px;
  overflow: hidden;
  border: 6px solid #0d0d0f;
  box-shadow: 0 0 0 1px var(--line-strong);
}

/* ── Arch ──────────────────────────── */
.cov__arch {
  display: grid;
  grid-template-columns: minmax(0, 0.5fr) minmax(0, 1.5fr);
  gap: 2rem;
}

.cov__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1.5rem;

  span {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.4em 0.85em;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    color: var(--muted);
  }
}

/* ── Next ──────────────────────────── */
.cov__next {
  display: grid;
  gap: 1rem;
  justify-items: start;
  padding: clamp(3rem, 8vw, 6rem) 0 clamp(4rem, 10vw, 8rem);
  border-top: 1px solid var(--line);
  text-align: left;

  .mono { color: var(--muted); }
}

.cov__next-name {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(2.6rem, 9vw, 8rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
  transition: transform 0.6s var(--ease-out);
}

.cov__next:hover .cov__next-name { transform: translateX(1.5rem); }

@media (max-width: 860px) {
  .cov__story, .cov__arch, .cov__features { grid-template-columns: 1fr; }
  .cov__features li:nth-child(n) { padding: 1.25rem 0; border-left: 0; }
  .cov__shots { grid-template-columns: 1fr 0.45fr; }
  .cov__close .mono { display: none; }
}
</style>
