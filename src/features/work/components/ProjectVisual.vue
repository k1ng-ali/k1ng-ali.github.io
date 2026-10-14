<template>
  <HasharVisual v-if="project.visual === 'hashar'" />
  <DovtalabVisual v-else-if="project.visual === 'dovtalab'" />
  <PosVisual v-else-if="project.visual === 'pos'" />
  <BrowserVisual
    v-else
    :src="asset(project.shots.desktop)"
    :href="project.live ?? project.repo"
    :domain="project.domain ?? ''"
    :alt="t(`work.items.${project.id}.name`)"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { asset } from '@/shared/lib/asset.ts'
import type { Project } from '../types.ts'
import HasharVisual from './visuals/HasharVisual.vue'
import DovtalabVisual from './visuals/DovtalabVisual.vue'
import PosVisual from './visuals/PosVisual.vue'
import BrowserVisual from './visuals/BrowserVisual.vue'

defineProps<{
  project: Project
}>()

const { t } = useI18n()
</script>
