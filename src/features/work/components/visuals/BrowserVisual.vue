<template>
  <a
    ref="frameEl"
    class="bv"
    :href="href"
    target="_blank"
    rel="noopener"
    :data-cursor="t('work.open')"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <div class="bv__bar">
      <span class="bv__dots"><i></i><i></i><i></i></span>
      <span class="bv__url">mukhammadali.me/<b>{{ domain }}</b></span>
    </div>
    <div class="bv__view">
      <img :src="src" :alt="alt" loading="lazy" width="1440" height="900" />
    </div>
  </a>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, isFinePointer } from '@/shared/lib/gsap.ts'

defineProps<{
  src: string
  href: string
  domain: string
  alt: string
}>()

const { t } = useI18n()

const frameEl = ref<HTMLElement | null>(null)

// Лёгкий 3D-наклон окна за курсором
function onMove(e: MouseEvent) {
  if (!frameEl.value || !isFinePointer()) return
  const r = frameEl.value.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width - 0.5
  const py = (e.clientY - r.top) / r.height - 0.5
  gsap.to(frameEl.value, { rotateY: px * 8, rotateX: -py * 8, transformPerspective: 1200, duration: 0.6, ease: 'power3.out' })
}

function onLeave() {
  if (frameEl.value) gsap.to(frameEl.value, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' })
}
</script>

<style scoped lang="scss">
.bv {
  display: block;
  width: 100%;
  max-width: 760px;
  border-radius: 16px;
  overflow: hidden;
  background: #1b1b1e;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 50px 100px -24px rgba(0, 0, 0, 0.8),
    0 0 100px -30px var(--case-accent, transparent);
  will-change: transform;
}

.bv__bar {
  position: relative;
  display: flex;
  align-items: center;
  padding: 11px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.bv__dots {
  display: flex;
  gap: 6px;
  i { width: 10px; height: 10px; border-radius: 50%; background: #3a3a3f; }
}

.bv__url {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
  b { color: var(--text); font-weight: 500; }
}

.bv__view {
  overflow: hidden;
  aspect-ratio: 16 / 10;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    transition: transform 1.2s var(--ease-out);
  }
}

.bv:hover .bv__view img { transform: scale(1.04); }
</style>
