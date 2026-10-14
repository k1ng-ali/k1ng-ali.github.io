<template>
  <article class="case" :style="{ '--case-accent': project.accent }">
    <div class="case__info">
      <div class="case__index mono">
        <span class="case__num">{{ pad(index + 1) }}</span> / {{ pad(total) }}
      </div>

      <h3 class="case__name">{{ t(`${key}.name`) }}</h3>
      <p class="case__tagline">{{ t(`${key}.tagline`) }}</p>
      <p class="case__desc">{{ t(`${key}.desc`) }}</p>

      <ul class="case__facts">
        <li v-for="n in 3" :key="n">{{ t(`${key}.fact${n}`) }}</li>
      </ul>

      <dl class="case__meta">
        <div>
          <dt class="mono">{{ t('work.year') }}</dt>
          <dd>{{ project.year }}</dd>
        </div>
        <div>
          <dt class="mono">{{ t('work.role') }}</dt>
          <dd>{{ t(`${key}.role`) }}</dd>
        </div>
      </dl>

      <div class="case__stack">
        <span v-for="s in project.stack" :key="s">{{ s }}</span>
      </div>

      <div class="case__links">
        <button v-magnetic="0.25" class="btn case__more" @click="openCase(project.id)">
          {{ t('work.more') }} <span aria-hidden="true">→</span>
        </button>
        <a v-if="project.live" v-magnetic="0.25" :href="project.live" target="_blank" rel="noopener" class="btn btn--ghost">
          {{ t('work.live') }} ↗
        </a>
        <a v-magnetic="0.25" :href="project.repo" target="_blank" rel="noopener" class="btn btn--ghost">
          {{ t('work.repo') }} ↗
        </a>
      </div>
    </div>

    <div class="case__visual">
      <ProjectVisual :project="project" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { vMagnetic } from '@/shared/directives/magnetic.ts'
import type { Project } from '../types.ts'
import { useCaseView } from '../composables/useCaseView.ts'
import ProjectVisual from './ProjectVisual.vue'

const props = defineProps<{
  project: Project
  index: number
  total: number
}>()

const { t } = useI18n()
const { openCase } = useCaseView()

const key = computed(() => `work.items.${props.project.id}`)
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<style scoped lang="scss">
.case {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 6rem);
  padding: 0 var(--gutter);
}

/* ── Info ──────────────────────────── */
.case__info {
  display: grid;
  gap: clamp(0.6rem, 1.4vh, 1rem);
  max-width: 560px;
}

.case__index { color: var(--muted); }
.case__num { color: var(--case-accent); }

.case__name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(2.4rem, 5.2vw, 5rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.case__tagline {
  font-size: clamp(1.05rem, 1.4vw, 1.3rem);
  font-weight: 500;
  color: var(--case-accent);
  line-height: 1.3;
}

.case__desc {
  color: var(--muted);
  font-size: 0.98rem;
}

.case__facts {
  list-style: none;
  display: grid;
  gap: 0.35rem;
  font-size: 0.92rem;

  li {
    display: flex;
    gap: 0.7rem;
    &::before { content: '→'; color: var(--case-accent); }
  }
}

.case__meta {
  display: flex;
  gap: 2.5rem;
  padding-top: 0.6rem;
  border-top: 1px solid var(--line);

  dt { color: var(--dim); font-size: 0.68rem; margin-bottom: 0.15rem; }
  dd { font-size: 0.9rem; }
}

.case__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;

  span {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    padding: 0.35em 0.75em;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    color: var(--muted);
  }
}

.case__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.4rem;
}

.case__more {
  background: var(--case-accent);
  color: #0a0a0b;
  &:hover { background: #fff; }
}

/* ── Visual ────────────────────────── */
.case__visual {
  display: grid;
  place-items: center;
}

@media (max-width: 1023px) {
  .case {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}
</style>
