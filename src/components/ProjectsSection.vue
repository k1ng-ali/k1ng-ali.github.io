<template>
  <section id="projects">
    <div class="wrap">
      <div class="sec-hdr">
        <div class="lbl">Портфолио</div>
        <h2 class="stitle">Мои проекты</h2>
        <p class="ssub">Каждый проект — решение конкретной задачи. Несколько примеров моей работы.</p>
      </div>

      <div class="proj-grid" ref="gridEl">
        <div
          v-for="(proj, i) in projects"
          :key="proj.title"
          class="proj-card"
          :class="[`c${i + 1}`, { big: proj.featured }]"
        >
          <div class="proj-thumb">
            <div class="thumb-bg">
            </div>
            <img :src="proj.thumb" alt="project" class="proj-img"/>
          </div>
          <div class="proj-body">
            <div class="ptags">
              <span v-for="tag in proj.tags" :key="tag" class="ptag">{{ tag }}</span>
            </div>
            <h3>{{ proj.title }}</h3>
            <p>{{ proj.desc }}</p>
            <div class="proj-foot">
              <div class="plinks">
                <a v-if="proj.demo"   :href="proj.demo"   class="plink">🔗 Demo</a>
                <a v-if="proj.github" :href="proj.github" class="plink">📄 GitHub</a>
              </div>
              <span class="pyear">{{ proj.year }}</span>
            </div>
          </div>
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

const projects = [
  {
    title:    'ED-Tech платформа',
    desc:     'Основные задачи платформы — организация тренировочного тестирования, отслеживание прогресса, повышение мотивации за счёт геймификации и создание соревновательной среды. ',
    emoji:    '🛒',
    thumb: './projects/dovtalab-banner.png',
    tags:     ['Python', 'Aiogram', 'FastApi', 'Vue3'],
    demo:     'https://t.me/Dovtalabbot/dovtalab_app',
    github:   'https://github.com/k1ng-ali/Dovtalab_Bot',
    year:     '2024',
    featured: true,
  },
  {
    title:  'IT Tajikistan — Interactive Landing',
    desc:     'Концепт современного лендинга с интерактивным анимированным фоном. Реализована адаптивная grid-анимация с волновыми импульсами и динамическим свечением элементов без потери производительности. Основной фокус — визуальная глубина, чистая архитектура и оптимизация рендеринга.',
    emoji:    '✨',
    thumb: './projects/it-tajikistan.png',
    tags:    ['Vue 3', 'TypeScript', 'GSAP'],
    demo:   'https://it-tajikistan.dcn.tj/',
    github: 'https://github.com/k1ng-ali/it-tajikistan',
    year:   '2026',
    featured: false,
  },
  {
    title:    'Chashmai Umed — Event Landing',
    desc:     'Лендинг для анонса бесплатной встречи с предпринимателем Саидмуродом Давлатовым. Разработана адаптивная промо-страница с акцентом на конверсию, чёткую структуру информации и удобную регистрацию участников. Основной фокус — визуальная подача, доверие и быстрая загрузка.',
    emoji:    '🎤',
    thumb: './projects/chashmai-umed.png',
    tags:   ['Vue 3', 'TypeScript'],
    demo:   'https://mukhammadali.me/Chashmai-Umed/',
    year:   '2026',
    featured: false,
  },
]

const { init, cleanup } = useGsap(gridEl)

onMounted(() => {
  const cards = gridEl.value.querySelectorAll('.proj-card')
  init(() => {
    cards.forEach(card => {
      gsap.from(card, {
        opacity: 0,
        y: 35,
        duration: .6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 76%',
          once: true,
        }
      })
    })
  })
})
onUnmounted(cleanup)
</script>

<style scoped lang="scss">
#projects { background: var(--bg); }

.proj-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.proj-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform .3s, border-color .3s, box-shadow .3s;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(124, 109, 250, .35);
    box-shadow: 0 18px 55px rgba(0, 0, 0, .4), 0 0 0 1px rgba(124, 109, 250, .08);
  }

  &.big { grid-column: span 2; }
}

.proj-thumb {
  height: 190px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  overflow: hidden;

  & .proj-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;      // заполняет блок, обрезая лишнее
    object-position: center; // центрирует изображение
  }

  .proj-card.big & { height: 240px; }
}

.thumb-bg {
  position: absolute;
  inset: 0;
  opacity: .12;
  transition: opacity .3s, transform .4s;
}

.proj-card:hover .thumb-bg { opacity: .22; transform: scale(1.04); }

.c1 .thumb-bg { background: linear-gradient(135deg, #7c6dfa, #38d9f5); }
.c2 .thumb-bg { background: linear-gradient(135deg, #f97316, #eab308); }
.c3 .thumb-bg { background: linear-gradient(135deg, #ec4899, #a855f7); }

.proj-body {
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.ptags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: .9rem;
}

.ptag {
  font-size: .67rem;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: 50px;
  background: rgba(124, 109, 250, .1);
  color: var(--accent2);
  border: 1px solid rgba(124, 109, 250, .18);
}

.proj-body {
  h3 {
    font-family: var(--font2);
    font-size: 1.08rem;
    font-weight: 700;
    letter-spacing: -.02em;
    margin-bottom: .45rem;
  }

  p {
    color: var(--muted);
    font-size: .845rem;
    line-height: 1.62;
    flex: 1;
  }
}

.proj-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.1rem;
  padding-top: .9rem;
  border-top: 1px solid var(--border);
}

.plinks { display: flex; gap: .7rem; }

.plink {
  font-size: .78rem;
  font-weight: 600;
  color: var(--muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 3px;
  transition: color .2s;

  &:hover { color: var(--accent2); }
}

.pyear { font-size: .72rem; color: var(--muted); }

// Responsive
@media (max-width: 1024px) {
  .proj-grid { grid-template-columns: 1fr 1fr; }
  .proj-card.big { grid-column: span 2; }
}

@media (max-width: 768px) {
  .proj-grid { grid-template-columns: 1fr; }
  .proj-card.big { grid-column: auto; }
}
</style>
