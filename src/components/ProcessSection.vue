<template>
  <section id="process">
    <div class="wrap">
      <div class="sec-hdr">
        <div class="lbl">Как работаю</div>
        <h2 class="stitle">Простой процесс</h2>
        <p class="ssub">Чёткий план от идеи до запуска. Никакого хаоса.</p>
      </div>

      <div class="proc-grid" ref="gridEl">
        <div v-for="step in steps" :key="step.num" class="proc-step">
          <div class="pnum">{{ step.num }}</div>
          <div class="pico">{{ step.icon }}</div>
          <h4>{{ step.title }}</h4>
          <p>{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import {useGsap} from "@/util.ts";

gsap.registerPlugin(ScrollTrigger)

const gridEl = ref(null)

const steps = [
  { num: '01', icon: '🗣️', title: 'Брифинг',    desc: 'Разбираемся в задаче и целях. Первая консультация — бесплатно.' },
  { num: '02', icon: '🎨', title: 'Прототип',   desc: 'Дизайн и архитектура согласованы до написания кода.' },
  { num: '03', icon: '⚙️', title: 'Разработка', desc: 'Итерации по 1–2 недели. Видите прогресс в реальном времени.' },
  { num: '04', icon: '🚀', title: 'Запуск',      desc: 'Деплой, тесты и поддержка после запуска.' },
]
const { init, cleanup } = useGsap(gridEl)


onMounted(() => {
  init(()=> {
    gsap.from('.proc-step', {
      opacity: 0,
      y: 26,
      stagger: .2,
      duration: .6,
      delay:.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: gridEl.value,
        start: 'top 76%',
        once: true,
      }
    })
  })
})
onUnmounted(cleanup)
</script>

<style scoped lang="scss">
#process { background: var(--bg2); }

.proc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 1.95rem; left: 3rem; right: 3rem;
    height: 1px;
    background: linear-gradient(90deg, var(--accent), var(--accent3));
    opacity: .22;
  }
}

.proc-step {
  padding: 1.75rem 1.4rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);

  &:hover {
    border-color: rgba(124, 109, 250, .35);
    transform: translateY(-4px);
  }
}

.pnum {
  font-family: var(--font2);
  font-size: .72rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: .06em;
  margin-bottom: .9rem;
}

.pico {
  font-size: 1.85rem;
  margin-bottom: .9rem;
}

.proc-step {
  h4 { font-weight: 700; font-size: .95rem; margin-bottom: .4rem; letter-spacing: -.01em; }
  p  { font-size: .79rem; color: var(--muted); line-height: 1.58; }
}

@media (max-width: 1024px) {
  .proc-grid { grid-template-columns: 1fr 1fr; }
  .proc-grid::before { display: none; }
}

@media (max-width: 768px) {
  .proc-grid { grid-template-columns: 1fr; }
}
</style>
