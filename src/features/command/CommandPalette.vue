<template>
  <Transition name="cmd">
    <div v-if="isOpen" class="cmd" data-lenis-prevent @mousedown.self="close">
      <div class="cmd__panel" role="dialog" aria-modal="true" :aria-label="t('nav.search')">
        <div class="cmd__search">
          <span class="cmd__icon" aria-hidden="true">⌕</span>
          <input
            ref="inputEl"
            v-model="query"
            class="cmd__input"
            :placeholder="t('cmd.placeholder')"
            spellcheck="false"
            autocomplete="off"
            @keydown="onKeydown"
          />
          <kbd>esc</kbd>
        </div>

        <div ref="listEl" class="cmd__list">
          <template v-for="group in groups" :key="group.title">
            <div class="cmd__group mono">{{ group.title }}</div>
            <button
              v-for="item in group.items"
              :key="item.id"
              class="cmd__item"
              :class="{ 'cmd__item--active': flat[active]?.id === item.id }"
              :data-id="item.id"
              @mousemove="active = flat.indexOf(item)"
              @click="run(item)"
            >
              <span class="cmd__glyph" aria-hidden="true">{{ item.glyph }}</span>
              <span class="cmd__label">{{ item.label }}</span>
              <span v-if="item.hint" class="cmd__hint mono">{{ item.hint }}</span>
            </button>
          </template>
          <p v-if="!flat.length" class="cmd__empty">{{ t('cmd.empty') }}</p>
        </div>

        <div class="cmd__foot mono">
          <span><kbd>↑</kbd><kbd>↓</kbd> {{ t('cmd.navigate') }}</span>
          <span><kbd>↵</kbd> {{ t('cmd.run') }}</span>
          <span><kbd>esc</kbd> {{ t('cmd.esc') }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/shared/i18n'
import { lockScroll, scrollToTarget, unlockScroll } from '@/shared/lib/smoothScroll.ts'
import { copyText } from '@/shared/lib/clipboard.ts'
import { useToast } from '@/shared/composables/useToast.ts'
import { EMAIL, GITHUB_URL, TELEGRAM_URL } from '@/shared/contacts.ts'
import { PROJECTS } from '@/features/work/data.ts'
import { useCaseView } from '@/features/work/composables/useCaseView.ts'
import { useCommandPalette } from './useCommandPalette.ts'

interface Command {
  id: string
  label: string
  glyph: string
  hint?: string
  action: () => void
}

const SECTIONS = ['work', 'stack', 'about', 'process', 'contact'] as const

const { t, locale } = useI18n()
const { isOpen, close, toggle } = useCommandPalette()
const { openCase, closeCase } = useCaseView()
const toast = useToast()

const inputEl = ref<HTMLInputElement | null>(null)
const listEl = ref<HTMLElement | null>(null)
const query = ref('')
const active = ref(0)

const groups = computed(() => {
  const all: { title: string; items: Command[] }[] = [
    {
      title: t('cmd.sections'),
      items: SECTIONS.map((s, i) => ({
        id: `section-${s}`,
        label: t(`nav.${s}`),
        glyph: '→',
        hint: String(i + 1).padStart(2, '0'),
        action: () => { closeCase(); scrollToTarget(`#${s}`) },
      })),
    },
    {
      title: t('cmd.projects'),
      items: PROJECTS.map((p) => ({
        id: `case-${p.id}`,
        label: t(`work.items.${p.id}.name`),
        glyph: '◆',
        hint: t(`work.items.${p.id}.tagline`),
        action: () => openCase(p.id),
      })),
    },
    {
      title: t('cmd.actions'),
      items: [
        {
          id: 'copy-email',
          label: t('cmd.copyEmail'),
          glyph: '⧉',
          hint: EMAIL,
          action: async () => { if (await copyText(EMAIL)) toast.show(t('cmd.copied')) },
        },
        { id: 'tg', label: t('cmd.openTg'), glyph: '↗', action: () => window.open(TELEGRAM_URL, '_blank', 'noopener') },
        { id: 'gh', label: t('cmd.openGh'), glyph: '↗', action: () => window.open(GITHUB_URL, '_blank', 'noopener') },
        { id: 'lang', label: t('cmd.lang'), glyph: '⇄', hint: locale.value === 'ru' ? 'TJ' : 'RU', action: () => setLocale(locale.value === 'ru' ? 'tg' : 'ru') },
      ],
    },
  ]

  const q = query.value.trim().toLowerCase()
  if (!q) return all
  return all
    .map((g) => ({ ...g, items: g.items.filter((i) => `${i.label} ${i.hint ?? ''}`.toLowerCase().includes(q)) }))
    .filter((g) => g.items.length)
})

const flat = computed(() => groups.value.flatMap((g) => g.items))

watch(query, () => { active.value = 0 })

function run(item: Command) {
  close()
  item.action()
}

function onKeydown(e: KeyboardEvent) {
  const len = flat.value.length
  if (e.key === 'ArrowDown' && len) {
    e.preventDefault()
    active.value = (active.value + 1) % len
  } else if (e.key === 'ArrowUp' && len) {
    e.preventDefault()
    active.value = (active.value - 1 + len) % len
  } else if (e.key === 'Enter') {
    const item = flat.value[active.value]
    if (item) run(item)
  } else {
    return
  }
  nextTick(() => {
    listEl.value?.querySelector('.cmd__item--active')?.scrollIntoView({ block: 'nearest' })
  })
}

watch(isOpen, async (open) => {
  if (open) {
    query.value = ''
    active.value = 0
    lockScroll()
    await nextTick()
    inputEl.value?.focus()
  } else {
    unlockScroll()
  }
})

// Ctrl/Cmd + K — открыть из любого места, Esc — закрыть
const onGlobalKey = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    toggle()
  } else if (e.key === 'Escape' && isOpen.value) {
    e.stopImmediatePropagation()
    close()
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKey, { capture: true }))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKey, { capture: true }))
</script>

<style scoped lang="scss">
.cmd {
  position: fixed;
  inset: 0;
  z-index: 800;
  display: grid;
  justify-items: center;
  align-items: start;
  padding: 14vh var(--gutter) 2rem;
  background: rgba(5, 5, 6, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.cmd-enter-active, .cmd-leave-active { transition: opacity 0.3s; }
.cmd-enter-active .cmd__panel, .cmd-leave-active .cmd__panel { transition: transform 0.4s var(--ease-out); }
.cmd-enter-from, .cmd-leave-to { opacity: 0; }
.cmd-enter-from .cmd__panel { transform: translateY(16px) scale(0.98); }
.cmd-leave-to .cmd__panel { transform: scale(0.98); }

.cmd__panel {
  width: min(100%, 620px);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: #121214;
  border: 1px solid var(--line-strong);
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

/* ── Search ────────────────────────── */
.cmd__search {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid var(--line);
}

.cmd__icon { font-size: 1.3rem; color: var(--accent); }

.cmd__input {
  flex: 1;
  min-width: 0;
  background: none;
  border: 0;
  outline: none;
  color: var(--text);
  font: inherit;
  font-size: 1.05rem;

  &::placeholder { color: var(--dim); }
}

kbd {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 0.25em 0.5em;
  border-radius: 6px;
  border: 1px solid var(--line-strong);
  color: var(--muted);
  margin-right: 0.25em;
}

/* ── List ──────────────────────────── */
.cmd__list {
  overflow-y: auto;
  padding: 0.5rem;
}

.cmd__group {
  padding: 0.9rem 0.8rem 0.4rem;
  font-size: 0.65rem;
  color: var(--dim);
}

.cmd__item {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 1.5rem auto 1fr;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.8rem;
  border-radius: 10px;
  text-align: left;
  color: var(--muted);

  &--active {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text);
    .cmd__glyph { color: var(--accent); }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 25%;
      bottom: 25%;
      width: 2px;
      border-radius: 2px;
      background: var(--accent);
    }
  }
}

.cmd__glyph { text-align: center; color: var(--dim); }
.cmd__label { font-weight: 500; white-space: nowrap; }

.cmd__hint {
  justify-self: end;
  font-size: 0.65rem;
  color: var(--dim);
  text-transform: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.cmd__empty {
  padding: 2rem;
  text-align: center;
  color: var(--dim);
}

/* ── Foot ──────────────────────────── */
.cmd__foot {
  display: flex;
  gap: 1.5rem;
  padding: 0.8rem 1.2rem;
  border-top: 1px solid var(--line);
  font-size: 0.65rem;
  color: var(--dim);
  text-transform: none;
}

@media (max-width: 560px) {
  .cmd__hint, .cmd__foot { display: none; }
}
</style>
