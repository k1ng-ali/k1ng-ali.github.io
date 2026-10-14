<template>
  <Transition name="menu" @after-enter="revealLinks">
    <div v-if="open" ref="menuEl" class="menu" data-lenis-prevent>
      <nav class="menu__nav">
        <a
          v-for="(item, i) in items"
          :key="item.target"
          :href="item.target"
          class="menu__link"
          :class="{ 'menu__link--active': item.target === `#${activeSection}` }"
          @click.prevent="go(item.target)"
        >
          <span class="mono">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="menu__mask"><span class="menu__label">{{ t(item.key) }}</span></span>
        </a>
      </nav>

      <div class="menu__foot">
        <a :href="`mailto:${EMAIL}`" class="menu__email">{{ EMAIL }}</a>
        <div class="menu__row">
          <a :href="TELEGRAM_URL" target="_blank" rel="noopener" class="btn btn--accent">Telegram ↗</a>
          <a :href="GITHUB_URL" target="_blank" rel="noopener" class="btn btn--ghost">GitHub ↗</a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, prefersReducedMotion } from '@/shared/lib/gsap.ts'
import { lockScroll, scrollToTarget, unlockScroll } from '@/shared/lib/smoothScroll.ts'
import { EMAIL, GITHUB_URL, TELEGRAM_URL } from '@/shared/contacts.ts'

const props = defineProps<{
  open: boolean
  items: { key: string; target: string }[]
  activeSection: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const menuEl = ref<HTMLElement | null>(null)

function go(target: string) {
  emit('close')
  scrollToTarget(target)
}

function revealLinks() {
  if (prefersReducedMotion() || !menuEl.value) return
  gsap.from(menuEl.value.querySelectorAll('.menu__label'), { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.05 })
  gsap.from(menuEl.value.querySelectorAll('.menu__link .mono, .menu__foot'), { opacity: 0, duration: 0.6, delay: 0.2 })
}

watch(() => props.open, (v) => (v ? lockScroll() : unlockScroll()))
</script>

<style scoped lang="scss">
.menu {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  padding: calc(var(--header-h) + 2rem) var(--gutter) 2rem;
  background: var(--bg);
  overflow-y: auto;
}

.menu-enter-active, .menu-leave-active { transition: clip-path 0.7s var(--ease-out); }
.menu-enter-from, .menu-leave-to { clip-path: inset(0 0 100% 0); }

.menu__nav {
  display: grid;
}

.menu__link {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--line);

  .mono { color: var(--dim); }

  &--active .menu__label { color: var(--accent); }
}

.menu__mask { overflow: hidden; display: block; }

.menu__label {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.2rem, 10vw, 4.5rem);
  letter-spacing: -0.05em;
  line-height: 1.05;
}

.menu__foot {
  display: grid;
  gap: 1rem;
}

.menu__email {
  font-size: 1.1rem;
  color: var(--muted);
}

.menu__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
</style>
