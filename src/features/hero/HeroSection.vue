<template>
  <section id="hero" ref="heroEl" class="hero">
    <DotField class="hero__field" />

    <div ref="innerEl" class="hero__inner">
      <!-- 1. Мета-строка -->
      <div class="hero__meta mono">
        <span class="status"><i class="status__dot"></i>{{ t('hero.status') }}</span>
        <span class="hero__role">{{ t('hero.role') }}</span>
        <span class="clock">{{ t('hero.city') }} · {{ time }} <span class="dim">GMT+5</span></span>
      </div>

      <!-- 2. Заголовок -->
      <KineticTitle
        :key="locale"
        class="hero__title"
        :lines="[t('hero.line1'), t('hero.line2'), t('hero.line3')]"
        :accent-line="0"
        @revealed="revealRest"
      />

      <!-- 3. Интро + CTA -->
      <div class="hero__bottom">
        <div class="intro reveal">
          <img :src="asset('me.jpg')" alt="" class="intro__photo" width="64" height="64" />
          <p><strong>{{ t('hero.hello') }}</strong> {{ t('hero.lead') }}</p>
        </div>
        <div class="hero__ctas reveal">
          <a v-magnetic href="#work" class="btn btn--accent" @click.prevent="scrollToTarget('#work')">
            {{ t('hero.ctaWork') }} <span aria-hidden="true">↓</span>
          </a>
          <a v-magnetic :href="TELEGRAM_URL" target="_blank" rel="noopener" class="btn btn--ghost">
            {{ t('hero.ctaTg') }} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 4. Бегущая строка стека -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <template v-for="n in 2" :key="n">
          <span v-for="item in STACK" :key="item + n" class="marquee__item">{{ item }}<i>✳</i></span>
        </template>
      </div>
    </div>

    <span class="hero__hint mono">{{ t('hero.hint') }}</span>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, prefersReducedMotion } from '@/shared/lib/gsap.ts'
import { scrollToTarget } from '@/shared/lib/smoothScroll.ts'
import { vMagnetic } from '@/shared/directives/magnetic.ts'
import { asset } from '@/shared/lib/asset.ts'
import { TELEGRAM_URL } from '@/shared/contacts.ts'
import DotField from './components/DotField.vue'
import KineticTitle from './components/KineticTitle.vue'

const STACK = [
  'Vue 3', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Docker', 'Telegram Mini Apps',
  'Pinia', 'SQLAlchemy', 'GSAP', 'Aiogram', 'WebSocket', 'CI/CD',
]

const { t, locale } = useI18n()

const heroEl = ref<HTMLElement | null>(null)
const innerEl = ref<HTMLElement | null>(null)

// ── Часы Душанбе ──
const clockFmt = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Dushanbe', hour: '2-digit', minute: '2-digit' })
const time = ref(clockFmt.format(new Date()))
const clockTimer = window.setInterval(() => { time.value = clockFmt.format(new Date()) }, 10_000)

let ctx: gsap.Context | null = null
let revealed = false

// Остальное появляется после заголовка; при смене языка повторно не анимируем
function revealRest() {
  if (revealed || prefersReducedMotion()) return
  revealed = true
  gsap.to(heroEl.value?.querySelectorAll('.reveal, .hero__meta, .marquee, .hero__hint') ?? [], {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'expo.out',
    stagger: 0.08,
  })
}

onMounted(() => {
  if (prefersReducedMotion()) {
    heroEl.value?.classList.add('hero--static')
    return
  }

  ctx = gsap.context(() => {
    gsap.set('.reveal, .hero__meta, .marquee, .hero__hint', { opacity: 0, y: 24 })

    // Параллакс: контент уезжает и гаснет при скролле
    gsap.to(innerEl.value, {
      yPercent: -14,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: heroEl.value, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, heroEl.value ?? undefined)
})

onBeforeUnmount(() => {
  window.clearInterval(clockTimer)
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: calc(var(--header-h) + 2rem) 0 0;
  overflow: hidden;
}

.hero__field {
  position: absolute;
  inset: 0;
}

.hero__inner {
  position: relative;
  padding: 0 var(--gutter);
  pointer-events: none;

  a, button { pointer-events: auto; }
}

/* ── Meta ──────────────────────────── */
.hero__meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.25rem;
  margin-bottom: clamp(1rem, 3vw, 2.5rem);
  border-bottom: 1px solid var(--line);
  color: var(--muted);
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  color: var(--text);
}

.status__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 rgba(200, 255, 61, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  70%  { box-shadow: 0 0 0 9px rgba(200, 255, 61, 0); }
  100% { box-shadow: 0 0 0 0 rgba(200, 255, 61, 0); }
}

.dim { color: var(--dim); }

/* ── Bottom ────────────────────────── */
.hero__bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  margin-top: clamp(1.5rem, 4vw, 3rem);
  padding-bottom: clamp(1.5rem, 4vw, 3rem);
}

.intro {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  max-width: 520px;
  color: var(--muted);
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  pointer-events: auto;

  strong { color: var(--text); font-weight: 600; }
}

.intro__photo {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  object-position: 50% 38%;
  filter: grayscale(1) contrast(1.1);
  transition: filter 0.5s;
  &:hover { filter: none; }
}

.hero__ctas {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* ── Marquee ───────────────────────── */
.marquee {
  position: relative;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
  padding: 1rem 0;
}

.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee 38s linear infinite;
}

.marquee:hover .marquee__track { animation-play-state: paused; }

.marquee__item {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-display);
  font-size: clamp(1rem, 1.6vw, 1.35rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--muted);
  white-space: nowrap;

  i {
    font-style: normal;
    color: var(--accent);
    margin: 0 1.6rem;
  }
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

.hero__hint {
  position: absolute;
  right: var(--gutter);
  top: calc(var(--header-h) + 0.5rem);
  color: var(--dim);
  font-size: 0.68rem;
}

@media (max-width: 860px) {
  .hero__role, .hero__hint { display: none; }
  .hero__bottom { flex-direction: column; align-items: flex-start; }
}
</style>
