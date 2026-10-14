<template>
  <div ref="rootEl" class="archive" @mouseenter="onEnter" @mousemove="onMove" @mouseleave="hovered = null">
    <div class="archive__head">
      <span class="mono">✳ {{ t('archive.label') }}</span>
      <h3 class="archive__title">{{ t('archive.title') }}</h3>
    </div>

    <ul class="archive__list">
      <li v-for="(item, i) in ARCHIVE" :key="item.id">
        <a
          :href="item.href"
          target="_blank"
          rel="noopener"
          class="archive__row"
          :data-cursor="t('work.open')"
          @mouseenter="hovered = i"
        >
          <span class="archive__name">{{ t(`archive.items.${item.id}.name`) }}</span>
          <span class="archive__type">{{ t(`archive.items.${item.id}.type`) }}</span>
          <span class="archive__stack mono">{{ item.stack.join(' · ') }}</span>
          <span class="archive__year mono">{{ item.year }}</span>
        </a>
      </li>
    </ul>

    <!-- Превью летит за курсором; все картинки в стопке, видна только текущая -->
    <div ref="previewEl" class="archive__preview" :class="{ 'archive__preview--on': hovered !== null }" aria-hidden="true">
      <img
        v-for="(item, i) in ARCHIVE"
        :key="item.id"
        :src="asset(item.thumb)"
        alt=""
        loading="lazy"
        :class="{ active: hovered === i }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, isFinePointer } from '@/shared/lib/gsap.ts'
import { asset } from '@/shared/lib/asset.ts'
import { ARCHIVE } from '../data.ts'

const { t } = useI18n()

const rootEl = ref<HTMLElement | null>(null)
const previewEl = ref<HTMLElement | null>(null)
const hovered = ref<number | null>(null)

let xTo: gsap.QuickToFunc | null = null
let yTo: gsap.QuickToFunc | null = null

// Первое появление — сразу под курсором, а не вылет из угла
function onEnter(e: MouseEvent) {
  if (!xTo || !rootEl.value || !previewEl.value) return
  const r = rootEl.value.getBoundingClientRect()
  gsap.set(previewEl.value, { x: e.clientX - r.left, y: e.clientY - r.top })
  onMove(e)
}

function onMove(e: MouseEvent) {
  if (!xTo || !yTo || !rootEl.value) return
  const r = rootEl.value.getBoundingClientRect()
  xTo(e.clientX - r.left)
  yTo(e.clientY - r.top)
}

onMounted(() => {
  if (!isFinePointer() || !previewEl.value) return
  gsap.set(previewEl.value, { xPercent: -50, yPercent: -50 })
  xTo = gsap.quickTo(previewEl.value, 'x', { duration: 0.6, ease: 'power3' })
  yTo = gsap.quickTo(previewEl.value, 'y', { duration: 0.6, ease: 'power3' })
})
</script>

<style scoped lang="scss">
.archive {
  position: relative;
  padding: clamp(4rem, 8vw, 7rem) var(--gutter) clamp(5rem, 10vw, 8rem);
}

.archive__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;

  .mono { color: var(--muted); }
}

.archive__title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(2rem, 4vw, 3.5rem);
  letter-spacing: -0.05em;
}

.archive__list {
  list-style: none;
  border-top: 1px solid var(--line-strong);
}

.archive__row {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 0.8fr) 4rem;
  align-items: baseline;
  gap: 1.5rem;
  padding: clamp(1.1rem, 2.4vw, 1.8rem) 0;
  border-bottom: 1px solid var(--line-strong);
  transition: padding 0.5s var(--ease-out), color 0.3s;

  &:hover {
    padding-left: 1rem;
    .archive__name { color: var(--accent); }
  }
}

.archive__name {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.6vw, 2.2rem);
  letter-spacing: -0.04em;
  transition: color 0.3s;
}

.archive__type { color: var(--muted); }
.archive__stack { color: var(--dim); text-transform: none; }
.archive__year { color: var(--muted); text-align: right; }

/* ── Preview ───────────────────────── */
.archive__preview {
  position: absolute;
  top: 0;
  left: 0;
  width: clamp(240px, 22vw, 340px);
  aspect-ratio: 16 / 10;
  border-radius: 14px;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  scale: 0.6;
  transition: opacity 0.35s, scale 0.5s var(--ease-out);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7);

  &--on { opacity: 1; scale: 1; }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    opacity: 0;
    transition: opacity 0.3s;
    &.active { opacity: 1; }
  }
}

@media (hover: none), (pointer: coarse) {
  .archive__preview { display: none; }
}

@media (max-width: 760px) {
  .archive__row { grid-template-columns: 1fr auto; }
  .archive__type, .archive__stack { display: none; }
}
</style>
