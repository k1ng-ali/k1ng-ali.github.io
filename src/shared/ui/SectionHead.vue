<template>
  <header ref="rootEl" class="shead" :class="{ 'shead--stacked': stacked }">
    <span class="mono shead__label"><b>{{ index }}</b> — {{ label }}</span>
    <h2 class="shead__title">
      <span class="shead__mask"><span class="shead__inner">{{ title }}<sup v-if="count">{{ count }}</sup></span></span>
    </h2>
    <p v-if="lead" class="shead__lead">{{ lead }}</p>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, prefersReducedMotion } from '@/shared/lib/gsap.ts'

defineProps<{
  index: string
  label: string
  title: string
  lead?: string
  count?: string
  stacked?: boolean   // лид под заголовком, а не справа
}>()

const rootEl = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (prefersReducedMotion() || !rootEl.value) return
  ctx = gsap.context(() => {
    const st = { trigger: rootEl.value, start: 'top 80%' }
    gsap.from('.shead__inner', { yPercent: 105, duration: 1.2, ease: 'expo.out', scrollTrigger: st })
    gsap.from('.shead__label, .shead__lead', { opacity: 0, y: 20, duration: 1, ease: 'expo.out', stagger: 0.1, scrollTrigger: st })
  }, rootEl.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<style scoped lang="scss">
.shead {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 1.5rem 3rem;

  &--stacked { grid-template-columns: 1fr; }
}

.shead__label {
  grid-column: 1 / -1;
  color: var(--muted);
  b { color: var(--accent); font-weight: 500; }
}

.shead__title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(3.2rem, 12vw, 12rem);
  line-height: 0.85;
  letter-spacing: -0.06em;
}

.shead__mask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.08em;
}

.shead__inner {
  display: inline-block;

  sup {
    font-family: var(--font-mono);
    font-size: 0.14em;
    font-weight: 400;
    letter-spacing: 0;
    color: var(--accent);
    vertical-align: top;
    margin-left: 0.4em;
  }
}

.shead__lead {
  max-width: 340px;
  color: var(--muted);
  padding-bottom: 0.8rem;
}

@media (max-width: 1023px) {
  .shead { grid-template-columns: 1fr; }
}
</style>
