<template>
  <section id="hero" ref="heroEl">
    <div class="hero-noise"></div>
    <div class="hero-grid">

      <!-- Left: Text -->
      <div>
        <div class="status-pill" ref="badge">
          <span class="status-dot"></span>Открыт для новых проектов
        </div>
        <h1 class="hero-title" ref="title">
          Создаю&nbsp;продукты,<br>
          которые <span class="grad">работают</span>
        </h1>
        <p class="hero-desc" ref="desc">
          Привет, я <strong>Мухаммадали</strong> — Full-Stack разработчик.
          Строю <strong>веб-приложения</strong> от идеи до запуска: красиво, быстро и с умом.
        </p>
        <div class="hero-btns" ref="btns">
          <a href="#cta" class="btn-p">✉️&nbsp; Написать мне</a>
          <a href="#projects" class="btn-s">Смотреть проекты ↓</a>
        </div>
      </div>

      <!-- Right: Avatar -->
      <div class="hero-right" ref="visual">
        <div class="avatar-wrap">
          <div class="avatar-ring2"></div>
          <div class="avatar-ring"></div>
          <div class="avatar-circle">
            <img src="/pic.bmp" alt="Фото" />
          </div>
          <div class="float-chip">
            <span class="chip-icon">🚀</span>
            <div>
              <div class="chip-val">Full-Stack</div>
              <div class="chip-lbl">Frontend + Backend</div>
            </div>
          </div>
          <div class="float-chip">
            <span class="chip-icon">⭐</span>
            <div>
              <div class="chip-val">МИЭТ • 3 курс</div>
              <div class="chip-lbl">Программная инженерия</div>
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
import {useGsap} from '@/util.ts'

const badge  = ref(null)
const title  = ref(null)
const desc   = ref(null)
const btns   = ref(null)
const visual = ref(null)

const heroEl = ref(null)
const {init, cleanup} = useGsap(heroEl)

onMounted(() => {
  init(() => {
    gsap.from(badge.value, {
      opacity: 0,
      y: 18,

    })
    gsap.from(title.value, {
      opacity: 0,
      y: 28,

    }, '-=.25')
    gsap.from(desc.value, {
      opacity: 0,
      y: 18,

    }, '-=.35')
    gsap.from(btns.value, {
      opacity: 0,
      y: 18,
      duration: .50}, '-=.30')
    gsap.from(visual.value, {
      opacity: 0,
      scale: .88,
      ease: 'back.out(1.4)'},
        '-=.55')

    gsap.to('.float-chip', {
      y: -5,  ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: .9,
    })
  })
})
onUnmounted(cleanup)
</script>

<style scoped lang="scss">
#hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 110px 6% 80px;
  position: relative;
  overflow: hidden;
}

.hero-noise {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 90% 65% at 50% -5%, rgba(124, 109, 250, .13) 0%, transparent 55%),
    radial-gradient(ellipse 45% 45% at 85% 85%, rgba(56, 217, 245, .07) 0%, transparent 50%),
    radial-gradient(ellipse 35% 35% at 10% 90%, rgba(124, 109, 250, .05) 0%, transparent 50%);
  pointer-events: none;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

// Status pill
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(74, 222, 128, .08);
  border: 1px solid rgba(74, 222, 128, .2);
  padding: 5px 14px;
  border-radius: 50px;
  font-size: .78rem;
  color: var(--green);
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: .01em;
}

.status-dot {
  width: 6px; height: 6px;
  background: var(--green);
  border-radius: 50%;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: .3; }
}

// Title
.hero-title {
  font-family: var(--font2);
  font-size: clamp(2.6rem, 4.5vw, 4rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -.05em;
  margin-bottom: 1.25rem;
}

.grad {
  background: linear-gradient(130deg, var(--accent2) 0%, var(--accent3) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// Description
.hero-desc {
  font-size: 1.05rem;
  color: var(--muted);
  max-width: 460px;
  margin-bottom: 2.5rem;
  line-height: 1.75;

  strong { color: var(--text); font-weight: 600; }
}

.hero-btns {
  display: flex;
  gap: .875rem;
  flex-wrap: wrap;
}

// Avatar
.hero-right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-wrap {
  position: relative;
  width: 360px;
  height: 360px;
}

.avatar-ring {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 1px solid transparent;
  background: linear-gradient(135deg, var(--accent), var(--accent3)) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  animation: rotatering 10s linear infinite;
}

.avatar-ring2 {
  position: absolute;
  inset: -28px;
  border-radius: 50%;
  border: 1px solid rgba(124, 109, 250, .12);
  animation: rotatering 20s linear infinite reverse;
}

@keyframes rotatering { to { transform: rotate(360deg); } }

.avatar-circle {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: var(--bg3);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7.5rem;
  overflow: hidden;
  position: relative;

  img { width: 100%; height: 100%; object-fit: cover; }
}

// Float chips
.float-chip {
  position: absolute;
  background: rgba(13, 13, 22, .92);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  gap: 9px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, .5);
  white-space: nowrap;

  &:nth-child(4) { top: 0;    right: -20px; }
  &:nth-child(5) { bottom: 5%; left: -20px; }
}

.chip-icon { font-size: 1.25rem; }
.chip-val  { font-size: .9rem; font-weight: 700; line-height: 1.1; }
.chip-lbl  { font-size: .7rem; color: var(--muted); }

// Responsive
@media (max-width: 1024px) {
  .hero-grid      { grid-template-columns: 1fr; gap: 3rem; }
  .hero-right     { order: -1; }
  .avatar-wrap    { width: 260px; height: 260px; }
  .float-chip:nth-child(4) { right: -5px; }
  .float-chip:nth-child(5) { left:  -5px; }
}

@media (max-width: 768px) {
  #hero         { padding: 90px 5% 60px; text-align: center; }
  .hero-desc    { margin: 0 auto 2rem; }
  .hero-btns    { justify-content: center; }
  .hero-right   { justify-content: center; }
  .float-chip   { display: none; }
  .avatar-wrap  { width: 200px; height: 200px; }
}
</style>
