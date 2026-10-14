<template>
  <header class="header" :class="{ 'header--scrolled': scrolled || menuOpen }">
    <a href="#hero" class="logo" @click.prevent="go('#hero')">
      <span class="logo__mark">M<i></i>A</span>
      <span class="logo__name">mukhammadali</span>
    </a>

    <nav class="nav">
      <a
        v-for="item in NAV"
        :key="item.target"
        :href="item.target"
        class="nav__link"
        :class="{ 'nav__link--active': item.target === `#${activeSection}` }"
        @click.prevent="go(item.target)"
      >
        {{ t(item.key) }}
      </a>
    </nav>

    <div class="header__right">
      <button class="search" :aria-label="t('nav.search')" @click="openPalette">
        <span aria-hidden="true">⌕</span><kbd>{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
      </button>

      <div class="lang" role="group" aria-label="Language">
        <button
          v-for="l in LOCALES"
          :key="l.code"
          class="lang__btn"
          :class="{ 'lang__btn--active': locale === l.code }"
          :aria-pressed="locale === l.code"
          @click="setLocale(l.code)"
        >
          {{ l.label }}
        </button>
      </div>

      <a v-magnetic="0.3" :href="TELEGRAM_URL" target="_blank" rel="noopener" class="btn btn--accent header__cta">
        {{ t('nav.cta') }}
      </a>

      <button
        class="burger"
        :class="{ 'burger--open': menuOpen }"
        :aria-label="menuOpen ? t('nav.close') : t('nav.menu')"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <i></i><i></i>
      </button>
    </div>
  </header>

  <MobileMenu :open="menuOpen" :items="NAV" :active-section="activeSection" @close="menuOpen = false" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALES, setLocale } from '@/shared/i18n'
import { ScrollTrigger } from '@/shared/lib/gsap.ts'
import { scrollToTarget } from '@/shared/lib/smoothScroll.ts'
import { vMagnetic } from '@/shared/directives/magnetic.ts'
import { TELEGRAM_URL } from '@/shared/contacts.ts'
import { useCommandPalette } from '@/features/command/useCommandPalette.ts'
import MobileMenu from './MobileMenu.vue'

const NAV = [
  { key: 'nav.work', target: '#work' },
  { key: 'nav.stack', target: '#stack' },
  { key: 'nav.about', target: '#about' },
  { key: 'nav.process', target: '#process' },
  { key: 'nav.contact', target: '#contact' },
]

const { t, locale } = useI18n()
const { open: openPalette } = useCommandPalette()

const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
const scrolled = ref(false)
const menuOpen = ref(false)
const activeSection = ref('')

function go(target: string) {
  menuOpen.value = false
  scrollToTarget(target)
}

const onScroll = () => { scrolled.value = window.scrollY > 40 }

let triggers: ScrollTrigger[] = []

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  // Подсветка текущей секции; refreshPriority -1 — считаем после пина в «Работах»
  triggers = NAV.map(({ target }) => ScrollTrigger.create({
    trigger: target,
    start: 'top 50%',
    end: 'bottom 50%',
    refreshPriority: -1,
    onToggle: (self) => {
      if (self.isActive) activeSection.value = target.slice(1)
      else if (activeSection.value === target.slice(1)) activeSection.value = ''
    },
  }))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  triggers.forEach((st) => st.kill())
})
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--header-h);
  padding: 0 var(--gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: background 0.4s, backdrop-filter 0.4s, border-color 0.4s;
  border-bottom: 1px solid transparent;

  &--scrolled {
    background: rgba(10, 10, 11, 0.6);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-color: var(--line);
  }
}

/* ── Logo ──────────────────────────── */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo__mark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.02em;
  display: inline-flex;
  align-items: center;

  i {
    width: 6px;
    height: 6px;
    margin: 0 3px;
    border-radius: 50%;
    background: var(--accent);
  }
}

.logo__name {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--muted);
}

/* ── Nav ───────────────────────────── */
.nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1.75rem;
}

.nav__link {
  position: relative;
  font-size: 0.9rem;
  color: var(--muted);
  transition: color 0.25s;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -8px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--accent);
    transform: translateX(-50%) scale(0);
    transition: transform 0.4s var(--ease-out);
  }

  &:hover { color: var(--text); }

  &--active {
    color: var(--text);
    &::after { transform: translateX(-50%) scale(1); }
  }
}

/* ── Right side ────────────────────── */
.header__right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.search {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 36px;
  padding: 0 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  color: var(--muted);
  transition: border-color 0.3s, color 0.3s;

  &:hover { border-color: var(--text); color: var(--text); }

  kbd {
    font-family: var(--font-mono);
    font-size: 0.65rem;
  }
}

.lang {
  display: flex;
  padding: 3px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
}

.lang__btn {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.45em 0.8em;
  border-radius: 999px;
  color: var(--muted);
  transition: background 0.3s, color 0.3s;

  &--active {
    background: var(--text);
    color: var(--bg);
  }
}

.header__cta { padding: 0.8em 1.3em; font-size: 0.85rem; }

/* ── Burger ────────────────────────── */
.burger {
  display: none;
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--line-strong);

  i {
    position: absolute;
    left: 50%;
    width: 16px;
    height: 1.5px;
    margin-left: -8px;
    background: var(--text);
    transition: transform 0.4s var(--ease-out);

    &:first-child { top: 16px; }
    &:last-child { top: 22px; }
  }

  &--open i:first-child { transform: translateY(3px) rotate(45deg); }
  &--open i:last-child { transform: translateY(-3px) rotate(-45deg); }
}

@media (max-width: 1100px) {
  .nav { display: none; }
  .burger { display: block; }
}

@media (max-width: 860px) {
  .logo__name, .search { display: none; }
}

@media (max-width: 480px) {
  .header__cta { display: none; }
}
</style>
