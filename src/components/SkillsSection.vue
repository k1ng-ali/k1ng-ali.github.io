<template>
  <section id="skills"  ref="sectionRef">
    <div class="wrap">
      <div class="sec-hdr">
        <div class="lbl">Технологии</div>
        <h2 class="stitle">Мой стек</h2>
        <p class="ssub">Выбираю инструмент под задачу. Вот с чем работаю каждый день.</p>
      </div>

      <div class="skill-cats">
        <div
          v-for="cat in categories"
          :key="cat.label"
          class="skill-cat"
          :ref="el => catRefs[cat.label] = el"
        >
          <h3>{{ cat.label }}</h3>
          <div class="chips">
            <span
              v-for="skill in cat.skills"
              :key="skill.name"
              class="chip"
            >
              <span class="chip-i">{{ skill.icon }}</span>
              {{ skill.name }}
              <span v-if="skill.tag" class="chip-tag">{{ skill.tag }}</span>
            </span>
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
const sectionRef = ref(null)
const catRefs = ref({})

const categories = [
  {
    label: 'Frontend',
    skills: [
      { icon: '💚', name: 'Vue 3',       tag: 'PRO' },
      { icon: '⚛️', name: 'React'},
      { icon: '🔷', name: 'TypeScript', tag: 'PRO' },
      { icon: '🟨', name: 'JavaScript' },
      { icon: '🌐', name: 'HTML / CSS' },
      { icon: '🎨', name: 'SCSS' },
      { icon: '✨', name: 'GSAP' },
    ],
  },
  {
    label: 'Backend',
    skills: [
      { icon: '🐍', name: 'Python / FastAPI',tag: 'PRO'  },
      { icon: '🐘', name: 'PostgreSQL' },
      { icon: '🍃', name: 'Aiogram',tag: 'PRO'  },
      { icon: '🔗', name: 'REST API' },
    ],
  },
  {
    label: 'Инструменты',
    skills: [
      { icon: '🐳', name: 'Docker' },
      { icon: '🐙', name: 'Git / GitHub' },
      { icon: '🎨', name: 'Figma' },
      { icon: '⚡', name: 'Vite' },
      { icon: '☁️', name: 'GitActions' },
    ],
  },
]

const { init, cleanup } = useGsap(sectionRef)

onMounted(() => {
  init(() => {
    categories.forEach(cat => {
      const el = catRefs.value[cat.label]
      if (!el) return

      gsap.from(el, {
        opacity: 0,
        y: 14,
        scale: .9,
        duration: .45,
        ease: 'back.out(1.3)',

        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true
        }
      })
    })
  })
})

onUnmounted(cleanup)
</script>

<style scoped lang="scss">
#skills { background: var(--bg2); }

.skill-cats {
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
}

.skill-cat {
  h3 {
    font-size: .75rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1.1rem;
    display: flex;
    align-items: center;
    gap: 10px;

    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: .65rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 50px;
  font-size: .845rem;
  font-weight: 500;
  cursor: default;
  transition: border-color .22s, background .22s, transform .18s, box-shadow .22s;

  &:hover {
    border-color: var(--accent);
    background: rgba(124, 109, 250, .09);
    transform: translateY(-2px);
    box-shadow: 0 4px 18px rgba(124, 109, 250, .15);
  }
}

.chip-i {
  font-size: 1rem;
}

.chip-tag {
  font-size: .66rem;
  background: rgba(124, 109, 250, .18);
  color: var(--accent2);
  padding: 2px 7px;
  border-radius: 50px;
  font-weight: 700;
  margin-left: 2px;
}
</style>
