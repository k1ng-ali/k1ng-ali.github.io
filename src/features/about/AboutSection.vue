<template>
  <section id="about" ref="sectionEl" class="about">
    <span class="mono about__label"><b>{{ t('about.index') }}</b> — {{ t('about.label') }}</span>

    <div class="about__grid">
      <!-- 1. Фото с вращающейся подписью -->
      <div class="about__media">
        <div ref="photoEl" class="about__photo">
          <img :src="asset('me.jpg')" alt="Мухаммадали Астанакулов" width="720" height="960" loading="lazy" />
        </div>
        <svg class="about__badge" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text><textPath href="#badge-circle">FULL-STACK ✳ DEVELOPER ✳ DUSHANBE ✳</textPath></text>
          <circle cx="60" cy="60" r="5" />
        </svg>
      </div>

      <!-- 2. Текст проявляется по словам при скролле -->
      <div class="about__content">
        <p :key="locale" ref="statementEl" class="about__statement">
          <span v-for="(word, i) in words" :key="i" class="about__word">{{ `${word} ` }}</span>
        </p>

        <dl class="about__facts">
          <div v-for="n in 4" :key="n" class="about__fact">
            <dt class="mono">{{ t(`about.f${n}k`) }}</dt>
            <dd>{{ t(`about.f${n}v`) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, prefersReducedMotion } from '@/shared/lib/gsap.ts'
import { asset } from '@/shared/lib/asset.ts'

const { t, locale } = useI18n()

const sectionEl = ref<HTMLElement | null>(null)
const photoEl = ref<HTMLElement | null>(null)
const statementEl = ref<HTMLElement | null>(null)

const words = computed(() => t('about.statement').split(' '))

let photoCtx: gsap.Context | null = null
let wordsCtx: gsap.Context | null = null

// Слова «загораются» по мере прокрутки; при смене языка пересобираем
function buildWords() {
  wordsCtx?.revert()
  if (!statementEl.value) return
  wordsCtx = gsap.context(() => {
    gsap.fromTo(
      '.about__word',
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: statementEl.value, start: 'top 80%', end: 'bottom 45%', scrub: true },
      },
    )
  }, statementEl.value)
}

watch(locale, async () => {
  if (prefersReducedMotion()) return
  await nextTick()
  buildWords()
})

onMounted(() => {
  if (prefersReducedMotion()) return
  buildWords()

  photoCtx = gsap.context(() => {
    // Фото раскрывается шторкой и слегка плывёт
    gsap.fromTo(photoEl.value, { clipPath: 'inset(100% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.4,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: photoEl.value, start: 'top 80%' },
    })
    gsap.fromTo('.about__photo img', { yPercent: -8, scale: 1.15 }, {
      yPercent: 8,
      scale: 1.05,
      ease: 'none',
      scrollTrigger: { trigger: sectionEl.value, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    gsap.from('.about__fact', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: '.about__facts', start: 'top 85%' },
    })
  }, sectionEl.value ?? undefined)
})

onBeforeUnmount(() => {
  photoCtx?.revert()
  wordsCtx?.revert()
})
</script>

<style scoped lang="scss">
.about {
  padding: clamp(5rem, 12vw, 10rem) var(--gutter);
  border-top: 1px solid var(--line);
}

.about__label {
  display: block;
  color: var(--muted);
  margin-bottom: clamp(2.5rem, 6vw, 5rem);
  b { color: var(--accent); font-weight: 500; }
}

.about__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  gap: clamp(2.5rem, 6vw, 7rem);
  align-items: start;
}

/* ── Media ─────────────────────────── */
.about__media {
  position: relative;
}

.about__photo {
  aspect-ratio: 3 / 4;
  border-radius: 24px;
  overflow: hidden;
  background: var(--bg-elev);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 30%;
    filter: grayscale(1) contrast(1.05);
    transition: filter 0.8s var(--ease-out);
  }

  &:hover img { filter: none; }
}

.about__badge {
  position: absolute;
  right: -2.5rem;
  bottom: -2.5rem;
  width: clamp(110px, 11vw, 150px);
  padding: 10px;
  border-radius: 50%;
  background: var(--accent);
  animation: spin 14s linear infinite;

  text {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.12em;
    fill: var(--accent-ink);
  }

  circle { fill: var(--accent-ink); }
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Content ───────────────────────── */
.about__statement {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.6rem, 3.1vw, 3rem);
  line-height: 1.2;
  letter-spacing: -0.035em;
}

.about__facts {
  margin-top: clamp(2.5rem, 5vw, 4rem);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--line);
}

.about__fact {
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--line);

  &:nth-child(odd) { padding-right: 1.5rem; }
  &:nth-child(even) { padding-left: 1.5rem; border-left: 1px solid var(--line); }

  dt { color: var(--dim); font-size: 0.68rem; margin-bottom: 0.35rem; }
  dd { font-size: 1.02rem; }
}

@media (max-width: 860px) {
  .about__grid { grid-template-columns: 1fr; }
  .about__media { max-width: 420px; }
  .about__badge { right: 0.75rem; bottom: -1.5rem; }
}

@media (max-width: 480px) {
  .about__facts { grid-template-columns: 1fr; }
  .about__fact:nth-child(n) { padding: 1rem 0; border-left: 0; }
}
</style>
