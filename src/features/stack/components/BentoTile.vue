<template>
  <article ref="tileEl" class="tile" @mousemove="onMove">
    <div class="tile__visual">
      <slot />
    </div>
    <div class="tile__body">
      <h3 class="tile__title">{{ title }}</h3>
      <p v-if="text" class="tile__text">{{ text }}</p>
      <div v-if="tags?.length" class="tile__tags">
        <span v-for="tag in tags" :key="tag">{{ tag }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  text?: string
  tags?: string[]
}>()

const tileEl = ref<HTMLElement | null>(null)

// Подсветка следует за курсором через CSS-переменные — без перерисовки Vue
function onMove(e: MouseEvent) {
  const el = tileEl.value
  if (!el) return
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}
</script>

<style scoped lang="scss">
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(1.25rem, 2vw, 1.75rem);
  border-radius: 24px;
  background: var(--bg-elev);
  border: 1px solid var(--line);
  overflow: hidden;
  isolation: isolate;

  // Мягкое пятно света под курсором
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(200, 255, 61, 0.07), transparent 60%);
    opacity: 0;
    transition: opacity 0.4s;
  }

  // Светящаяся рамка там, где курсор
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(200, 255, 61, 0.55), transparent 60%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  }

  &:hover::before, &:hover::after { opacity: 1; }
}

.tile__visual {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.tile__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.3rem, 1.8vw, 1.7rem);
  letter-spacing: -0.03em;
  margin-bottom: 0.4rem;
}

.tile__text {
  color: var(--muted);
  font-size: 0.93rem;
  max-width: 46ch;
}

.tile__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.9rem;

  span {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    padding: 0.35em 0.75em;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    color: var(--muted);
  }
}
</style>
