<template>
  <CustomCursor />
  <TheHeader />
  <main>
    <HeroSection />
    <WorkSection />
    <StackSection />
    <AboutSection />
    <ProcessSection />
    <ContactSection />
  </main>

  <!-- Оверлеи -->
  <CaseOverlay />
  <CommandPalette />
  <AppToast />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { initSmoothScroll, destroySmoothScroll } from '@/shared/lib/smoothScroll.ts'
import CustomCursor from '@/shared/ui/CustomCursor.vue'
import AppToast from '@/shared/ui/AppToast.vue'
import TheHeader from '@/features/header/TheHeader.vue'
import HeroSection from '@/features/hero/HeroSection.vue'
import WorkSection from '@/features/work/WorkSection.vue'
import CaseOverlay from '@/features/work/components/CaseOverlay.vue'
import StackSection from '@/features/stack/StackSection.vue'
import AboutSection from '@/features/about/AboutSection.vue'
import ProcessSection from '@/features/process/ProcessSection.vue'
import ContactSection from '@/features/contact/ContactSection.vue'
import CommandPalette from '@/features/command/CommandPalette.vue'

onMounted(initSmoothScroll)
onBeforeUnmount(destroySmoothScroll)
</script>
