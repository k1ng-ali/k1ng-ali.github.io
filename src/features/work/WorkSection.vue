<template>
  <section id="work" ref="sectionEl" class="work" :style="{ '--active-accent': activeProject?.accent ?? 'var(--accent)' }">
    <!-- 1. Заголовок секции -->
    <SectionHead
      class="work__head"
      :index="t('work.index')"
      :label="t('work.label')"
      :title="t('work.title')"
      :lead="t('work.lead')"
      :count="pad(PROJECTS.length)"
    />

    <!-- 2. Кейсы: на десктопе — горизонтальный скролл с закреплением -->
    <div ref="pinEl" class="work__pin">
      <div ref="trackEl" class="work__track">
        <WorkCase
          v-for="(p, i) in PROJECTS"
          :key="p.id"
          class="work__panel"
          :project="p"
          :index="i"
          :total="PROJECTS.length"
        />
      </div>

      <div class="work__hud" aria-hidden="true">
        <span class="mono">{{ pad(active + 1) }} / {{ pad(PROJECTS.length) }}</span>
        <div class="work__progress"><i ref="barEl"></i></div>
        <span class="mono work__hud-name">{{ activeProject ? t(`work.items.${activeProject.id}.name`) : '' }}</span>
      </div>
    </div>

    <!-- 3. Архив старых проектов -->
    <ArchiveList />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, ScrollTrigger } from '@/shared/lib/gsap.ts'
import { PROJECTS } from './data.ts'
import SectionHead from '@/shared/ui/SectionHead.vue'
import WorkCase from './components/WorkCase.vue'
import ArchiveList from './components/ArchiveList.vue'

const { t } = useI18n()

const sectionEl = ref<HTMLElement | null>(null)
const pinEl = ref<HTMLElement | null>(null)
const trackEl = ref<HTMLElement | null>(null)
const barEl = ref<HTMLElement | null>(null)

// -1 — ни один кейс ещё не в фокусе (фон по умолчанию)
const active = ref(-1)
const activeProject = computed(() => PROJECTS[active.value] ?? null)

const pad = (n: number) => String(Math.max(n, 1)).padStart(2, '0')

// Фон секции перетекает в фирменный цвет активного проекта
watch(active, (i) => {
  gsap.to(sectionEl.value, {
    backgroundColor: PROJECTS[i]?.tint ?? '#0a0a0b',
    duration: 0.9,
    ease: 'power2.out',
  })
})

let mm: gsap.MatchMedia | null = null

onMounted(() => {
  const panels = gsap.utils.toArray<HTMLElement>('.work__panel', trackEl.value)
  mm = gsap.matchMedia()

  // ── Десктоп: горизонтальный трек ──
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    const track = trackEl.value!
    // Ширина без полосы прокрутки, иначе последний кейс уезжает под неё
    const viewport = () => document.documentElement.clientWidth
    const distance = () => track.scrollWidth - viewport()
    const setPanelWidth = () => track.style.setProperty('--panel-w', `${viewport()}px`)
    setPanelWidth()
    ScrollTrigger.addEventListener('refreshInit', setPanelWidth)

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pinEl.value,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self: ScrollTrigger) => gsap.set(barEl.value, { scaleX: self.progress }),
        onEnter: () => { if (active.value < 0) active.value = 0 },
        onLeaveBack: () => { active.value = -1 },
        // К архиву фон возвращается к базовому
        onLeave: () => { active.value = -1 },
        onEnterBack: () => { active.value = PROJECTS.length - 1 },
      },
    })

    panels.forEach((panel: HTMLElement, i: number) => {
      ScrollTrigger.create({
        trigger: panel,
        containerAnimation: tween,
        start: 'left 55%',
        end: 'right 55%',
        onToggle: (self: ScrollTrigger) => { if (self.isActive) active.value = i },
      })

      // Визуал плывёт чуть медленнее текста — глубина
      gsap.fromTo(
        panel.querySelector('.case__visual'),
        { xPercent: 14 },
        {
          xPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        },
      )

      if (i === 0) return
      gsap.from(panel.querySelectorAll('.case__info > *'), {
        x: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 75%', toggleActions: 'play none none reverse' },
      })
    })

    // Первый кейс появляется вместе с закреплением
    if (panels[0]) gsap.from(panels[0].querySelectorAll('.case__info > *'), {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.06,
      scrollTrigger: { trigger: pinEl.value, start: 'top 65%' },
    })

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', setPanelWidth)
      track.style.removeProperty('--panel-w')
    }
  })

  // ── Мобильные / reduced motion: кейсы друг под другом ──
  mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
    panels.forEach((panel: HTMLElement, i: number) => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self: ScrollTrigger) => { if (self.isActive) active.value = i },
        onLeaveBack: () => { if (i === 0) active.value = -1 },
        onLeave: () => { if (i === PROJECTS.length - 1) active.value = -1 },
      })
    })
  })
})

onBeforeUnmount(() => mm?.revert())
</script>

<style scoped lang="scss">
.work {
  position: relative;
  background: var(--bg);
}

/* ── Head ──────────────────────────── */
.work__head {
  padding: clamp(5rem, 12vw, 10rem) var(--gutter) clamp(3rem, 6vw, 5rem);
}

/* ── Track ─────────────────────────── */
.work__pin { position: relative; }

.work__track {
  display: grid;
  gap: 7rem;
  padding-bottom: 7rem;
}

.work__hud { display: none; }

@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .work__pin {
    height: 100svh;
    overflow: hidden;
  }

  .work__track {
    display: flex;
    width: max-content;
    height: 100%;
    gap: 0;
    padding: 0;
  }

  .work__panel {
    width: var(--panel-w, 100vw);
    height: 100%;
    padding-top: calc(var(--header-h) + 1rem);
    padding-bottom: 4.5rem;
  }

  .work__hud {
    position: absolute;
    left: var(--gutter);
    right: var(--gutter);
    bottom: 1.75rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    color: var(--muted);
  }

  .work__progress {
    flex: 1;
    height: 1px;
    background: var(--line-strong);

    i {
      display: block;
      height: 100%;
      background: var(--active-accent);
      transform-origin: 0 50%;
      transform: scaleX(0);
      transition: background 0.6s;
    }
  }

  .work__hud-name {
    min-width: 9rem;
    text-align: right;
    color: var(--text);
  }
}
</style>
