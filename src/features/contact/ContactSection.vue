<template>
  <section id="contact" ref="sectionEl" class="contact">
    <span class="mono contact__label"><b>05</b> — {{ t('contact.label') }}</span>

    <h2 class="contact__title">
      <span class="contact__mask"><span class="contact__line">{{ t('contact.title1') }}</span></span>
      <span class="contact__mask"><span class="contact__line contact__accent">{{ t('contact.title2') }}</span></span>
    </h2>

    <!-- 1. Email + Telegram -->
    <div class="contact__main">
      <button class="contact__email" :data-cursor="copied ? t('contact.copied') : t('contact.copy')" @click="copyEmail">
        <span>{{ EMAIL }}</span>
        <span class="contact__copy mono">{{ copied ? t('contact.copied') : t('contact.copy') }}</span>
      </button>
      <a v-magnetic :href="TELEGRAM_URL" target="_blank" rel="noopener" class="btn btn--accent contact__tg">
        Telegram <span aria-hidden="true">↗</span>
      </a>
    </div>

    <!-- 2. Ссылки строками -->
    <ul class="links">
      <li v-for="link in LINKS" :key="link.label">
        <a :href="link.href" target="_blank" rel="noopener" class="links__row">
          <span class="links__label">{{ link.label }}</span>
          <span class="links__handle mono">{{ link.handle }}</span>
          <span class="links__arrow" aria-hidden="true">↗</span>
        </a>
      </li>
    </ul>

    <!-- 3. Подвал -->
    <footer class="foot mono">
      <span>© 2026 Мухаммадали Астанакулов</span>
      <span class="foot__reply"><i></i>{{ t('contact.reply') }}</span>
      <span>{{ t('contact.now') }} · {{ time }}</span>
      <button v-magnetic="0.4" class="foot__top" :aria-label="t('contact.top')" @click="scrollToTarget('#hero')">↑</button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, prefersReducedMotion } from '@/shared/lib/gsap.ts'
import { scrollToTarget } from '@/shared/lib/smoothScroll.ts'
import { copyText } from '@/shared/lib/clipboard.ts'
import { vMagnetic } from '@/shared/directives/magnetic.ts'
import { EMAIL, GITHUB_URL, INSTAGRAM_URL, TELEGRAM, TELEGRAM_URL } from '@/shared/contacts.ts'

const LINKS = [
  { label: 'Telegram', handle: `@${TELEGRAM}`, href: TELEGRAM_URL },
  { label: 'GitHub', handle: 'k1ng-ali', href: GITHUB_URL },
  { label: 'Instagram', handle: '@_muhammad_.al1', href: INSTAGRAM_URL },
]

const { t } = useI18n()

const sectionEl = ref<HTMLElement | null>(null)
const copied = ref(false)

async function copyEmail() {
  if (!(await copyText(EMAIL))) {
    window.location.href = `mailto:${EMAIL}`
    return
  }
  copied.value = true
  window.setTimeout(() => { copied.value = false }, 1800)
}

// ── Часы Душанбе ──
const clockFmt = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Dushanbe', hour: '2-digit', minute: '2-digit' })
const time = ref(clockFmt.format(new Date()))
const clockTimer = window.setInterval(() => { time.value = clockFmt.format(new Date()) }, 10_000)

let ctx: gsap.Context | null = null

onMounted(() => {
  if (prefersReducedMotion() || !sectionEl.value) return
  ctx = gsap.context(() => {
    gsap.from('.contact__line', {
      yPercent: 105,
      duration: 1.3,
      ease: 'expo.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.contact__title', start: 'top 80%' },
    })
    gsap.from('.contact__main, .links li', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.07,
      scrollTrigger: { trigger: '.contact__main', start: 'top 90%' },
    })
  }, sectionEl.value)
})

onBeforeUnmount(() => {
  window.clearInterval(clockTimer)
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.contact {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3rem);
  padding: clamp(5rem, 12vw, 10rem) var(--gutter) 1.5rem;
  border-top: 1px solid var(--line);
}

.contact__label {
  color: var(--muted);
  b { color: var(--accent); font-weight: 500; }
}

/* ── Title ─────────────────────────── */
.contact__title {
  display: grid;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(2.6rem, 9.5vw, 10rem);
  line-height: 0.95;
  letter-spacing: -0.055em;
}

.contact__mask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.06em;
}

.contact__line { display: inline-block; }
.contact__accent { color: var(--accent); font-weight: 500; }

/* ── Main row ──────────────────────── */
.contact__main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem 2rem;
}

.contact__email {
  display: inline-flex;
  align-items: baseline;
  gap: 1rem;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3vw, 2.6rem);
  font-weight: 400;
  letter-spacing: -0.03em;
  text-align: left;
  padding-bottom: 0.25em;
  border-bottom: 1px solid var(--line-strong);
  transition: color 0.3s, border-color 0.3s;
  word-break: break-all;

  &:hover { color: var(--accent); border-color: var(--accent); }
}

.contact__copy {
  font-size: 0.68rem;
  color: var(--dim);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.contact__tg { padding: 1.2em 2em; font-size: 1rem; }

/* ── Links ─────────────────────────── */
.links {
  list-style: none;
  border-top: 1px solid var(--line);
}

.links__row {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 2rem;
  padding: clamp(1rem, 2.4vw, 1.6rem) 0.5rem;
  border-bottom: 1px solid var(--line);
  overflow: hidden;
  isolation: isolate;
  transition: color 0.4s var(--ease-out), padding 0.5s var(--ease-out);

  // Лаймовая заливка выезжает снизу
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--accent);
    transform: translateY(101%);
    transition: transform 0.5s var(--ease-out);
  }

  &:hover {
    color: var(--accent-ink);
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    &::before { transform: translateY(0); }
    .links__handle { color: var(--accent-ink); }
    .links__arrow { transform: rotate(45deg); }
  }
}

.links__label {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  letter-spacing: -0.04em;
}

.links__handle { color: var(--muted); transition: color 0.4s; }

.links__arrow {
  font-size: 1.4rem;
  transition: transform 0.5s var(--ease-out);
}

/* ── Footer ────────────────────────── */
.foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  padding-top: 2rem;
  color: var(--dim);
  font-size: 0.68rem;
}

.foot__reply {
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  color: var(--muted);

  i { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
}

.foot__top {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  font-size: 1.1rem;
  transition: background 0.3s, color 0.3s, border-color 0.3s;

  &:hover { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
}

@media (max-width: 640px) {
  .links__handle { display: none; }
}
</style>
