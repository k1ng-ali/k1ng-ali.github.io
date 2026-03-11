<template>
  <section id="cta" ref="sectionEl">
    <div class="cta-glow"></div>
    <div class="wrap cta-inner">
      <div class="lbl">Контакты</div>
      <h2 class="stitle">Есть идея? Давай обсудим</h2>
      <p class="ssub">
        Расскажи задачу — обсудим на бесплатной 30-минутной консультации.
        Отвечаю быстро.
      </p>
      <div class="cta-btns">
        <a :href="`mailto:${email}`" class="btn-p">
          ✉️&nbsp; Написать письмо
        </a>
        <a :href="`https://t.me/${telegram}`" target="_blank" rel="noopener" class="btn-tg">
          ✈️&nbsp; Telegram
        </a>
        <!-- <a href="/resume.pdf" download class="resume-btn">📄&nbsp; Скачать резюме</a> -->
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

// ← Замени на свои данные
const email    = 'im.ali@astanaqulov.ru'
const telegram = 'King_a1i'

const sectionEl = ref(null)

const { init, cleanup } = useGsap(sectionEl)

onMounted(() => {
  const elements = sectionEl.value.querySelectorAll('.lbl, .stitle, .ssub, .cta-btns')
  init(() => {
    gsap.from(elements, {
      opacity: 0,
      y: 22,
      stagger: .13,
      duration: .65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top 80%',
        once: true,
      }
    })
  })
})
onUnmounted(cleanup)
</script>

<style scoped lang="scss">
#cta {
  padding: 7.5rem 6%;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: var(--bg2);
}

.cta-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 65% 65% at 50% 50%, rgba(124, 109, 250, .1) 0%, transparent 60%);
  pointer-events: none;
}

.cta-inner {
  position: relative;
  z-index: 1;

  .stitle { text-align: center; margin-bottom: .9rem; }
  .ssub   { text-align: center; margin: 0 auto 2.5rem; }
}

.cta-btns {
  display: flex;
  gap: .875rem;
  justify-content: center;
  flex-wrap: wrap;
}

// Telegram button variant (dark bg)
.btn-tg {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg3);
  color: var(--text);
  padding: 13px 26px;
  border-radius: 50px;
  font-weight: 600;
  font-size: .9rem;
  text-decoration: none;
  border: 1px solid var(--border);
  transition: border-color .3s, background .3s, transform .2s;

  &:hover {
    border-color: rgba(255, 255, 255, .18);
    background: var(--bg2);
    transform: translateY(-2px);
  }
}

.resume-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--text);
  padding: 13px 26px;
  border-radius: 50px;
  font-weight: 600;
  font-size: .9rem;
  text-decoration: none;
  border: 1px solid var(--border);
  background: transparent;
  transition: border-color .3s, background .3s, transform .2s;

  &:hover {
    border-color: rgba(255, 255, 255, .18);
    background: var(--card);
    transform: translateY(-2px);
  }
}
</style>
