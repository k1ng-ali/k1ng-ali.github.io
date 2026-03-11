<template>
  <div id="stats" ref="statsEl">
    <div class="stats-row wrap">
      <div v-for="stat in stats" :key="stat.label" class="stat-item">
        <div class="snum" v-html="stat.value"></div>
        <div class="sdesc">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import gsap from 'gsap'
import {useGsap} from "@/util.ts";
import ScrollTrigger  from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '<em>3</em>+',               label: 'Лет в коде' },
  { value: 'Vue<em>&nbsp;+&nbsp;</em>React', label: 'Основной Frontend стек' },
  { value: 'PY<em>&nbsp;+&nbsp;</em>FastAPI',   label: 'Backend технологии' },
  { value: '<em>∞</em>',               label: 'Стремление к росту' },
]
const statsEl = ref(null)

const {init, cleanup} = useGsap(statsEl)


onMounted(() => {
  init(() => {
    gsap.from('.stat-item', {
      opacity: 0,
      y: 22,
      stagger: .09,
      duration: .6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: statsEl.value,
        start: 'top 82%',
        once: true,
      }
    })
  })
})

onUnmounted(cleanup)
</script>

<style scoped lang="scss">
#stats {
  padding: 3.5rem 6%;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}

.snum {
  font-family: var(--font2);
  font-size: 2.6rem;
  font-weight: 800;
  letter-spacing: -.05em;
  line-height: 1;
  color: var(--text);

  :deep(em) {
    font-style: normal;
    color: var(--accent);
  }
}

.sdesc {
  font-size: .82rem;
  color: var(--muted);
  margin-top: 5px;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .stats-row { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .snum      { font-size: 2.1rem; }
}
</style>
