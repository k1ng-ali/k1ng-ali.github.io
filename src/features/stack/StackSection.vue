<template>
  <section id="stack" ref="sectionEl" class="stack">
    <SectionHead
      :index="t('stack.index')"
      :label="t('stack.label')"
      :title="t('stack.title')"
      :lead="t('stack.lead')"
    />

    <div class="bento">
      <!-- 1. Frontend -->
      <BentoTile class="bento__front" :title="t('stack.front.title')" :text="t('stack.front.text')" :tags="['Vue 3', 'TypeScript', 'Pinia', 'GSAP', 'SCSS', 'React']">
        <CodeTyper />
      </BentoTile>

      <!-- 2. Backend -->
      <BentoTile class="bento__back" :title="t('stack.back.title')" :text="t('stack.back.text')" :tags="['FastAPI', 'SQLAlchemy 2', 'PostgreSQL', 'Alembic', 'Pydantic']">
        <RequestLog />
      </BentoTile>

      <!-- 3. Telegram -->
      <BentoTile class="bento__tg" :title="t('stack.tg.title')" :text="t('stack.tg.text')">
        <div class="tg" aria-hidden="true">
          <div class="tg__msg tg__msg--me">/start</div>
          <div class="tg__msg">
            Dovtalab 🎓
            <span class="tg__btn">Open App ↗</span>
          </div>
          <svg class="tg__plane" viewBox="0 0 24 24"><path d="M21.5 4.5 2.8 11.7c-.9.4-.9 1.6.1 1.9l4.6 1.4 1.8 5.6c.3.8 1.3 1 1.9.4l2.6-2.5 4.8 3.5c.7.5 1.6.1 1.8-.7L23 5.8c.2-1-.6-1.7-1.5-1.3Z" /></svg>
        </div>
      </BentoTile>

      <!-- 4. DevOps -->
      <BentoTile class="bento__ops" :title="t('stack.ops.title')" :text="t('stack.ops.text')">
        <DeployLog />
      </BentoTile>

      <!-- 5. Дизайн и моушн -->
      <BentoTile class="bento__motion" :title="t('stack.motion.title')" :text="t('stack.motion.text')" :tags="['Figma', 'GSAP', 'Lenis', 'Canvas']">
        <MotionCurve />
      </BentoTile>

      <!-- 6. Цифры -->
      <article ref="numsEl" class="bento__nums">
        <div v-for="n in NUMBERS" :key="n.key" class="num">
          <b class="num__value"><span class="num__count" :data-to="n.value">{{ n.value }}</span>{{ n.suffix }}</b>
          <span class="num__label">{{ t(`stack.nums.${n.key}`) }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, prefersReducedMotion } from '@/shared/lib/gsap.ts'
import SectionHead from '@/shared/ui/SectionHead.vue'
import BentoTile from './components/BentoTile.vue'
import CodeTyper from './components/CodeTyper.vue'
import RequestLog from './components/RequestLog.vue'
import DeployLog from './components/DeployLog.vue'
import MotionCurve from './components/MotionCurve.vue'

const NUMBERS = [
  { key: 'projects', value: 5, suffix: '' },
  { key: 'langs', value: 3, suffix: '' },
  { key: 'years', value: 3, suffix: '+' },
]

const { t } = useI18n()

const sectionEl = ref<HTMLElement | null>(null)
const numsEl = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (prefersReducedMotion() || !sectionEl.value) return

  ctx = gsap.context(() => {
    // Плитки поднимаются волной
    gsap.from('.bento > *', {
      y: 60,
      opacity: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: '.bento', start: 'top 80%' },
    })

    // Счётчики от нуля
    gsap.utils.toArray<HTMLElement>('.num__count').forEach((el) => {
      const counter = { v: 0 }
      gsap.to(counter, {
        v: Number(el.dataset.to),
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: numsEl.value, start: 'top 85%' },
        onUpdate: () => { el.textContent = String(Math.round(counter.v)) },
      })
    })
  }, sectionEl.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<style scoped lang="scss">
.stack {
  padding: clamp(5rem, 12vw, 10rem) var(--gutter);
}

/* ── Bento grid ────────────────────── */
.bento {
  margin-top: clamp(3rem, 6vw, 5rem);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-areas:
    'front  front  back   back'
    'front  front  tg     ops'
    'motion motion nums   nums';
  gap: 1rem;
}

.bento__front  { grid-area: front; }
.bento__back   { grid-area: back; }
.bento__tg     { grid-area: tg; }
.bento__ops    { grid-area: ops; }
.bento__motion { grid-area: motion; }
.bento__nums   { grid-area: nums; }

@media (max-width: 1023px) {
  .bento {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-areas:
      'front  front'
      'back   back'
      'tg     ops'
      'motion motion'
      'nums   nums';
  }
}

@media (max-width: 640px) {
  .bento {
    grid-template-columns: 1fr;
    grid-template-areas: 'front' 'back' 'tg' 'ops' 'motion' 'nums';
  }
}

/* ── Telegram tile ─────────────────── */
.tg {
  position: relative;
  display: grid;
  gap: 0.5rem;
  align-content: start;
  font-size: 0.85rem;
  padding-top: 0.25rem;
}

.tg__msg {
  justify-self: start;
  max-width: 85%;
  padding: 0.55em 0.9em;
  border-radius: 14px 14px 14px 4px;
  background: #1e2a36;
  color: #e7f1fb;
  display: grid;
  gap: 0.5rem;

  &--me {
    justify-self: end;
    border-radius: 14px 14px 4px 14px;
    background: #2aabee;
    color: #fff;
    font-family: var(--font-mono);
    font-size: 0.78rem;
  }
}

.tg__btn {
  display: block;
  text-align: center;
  padding: 0.45em 0.8em;
  border-radius: 8px;
  background: rgba(42, 171, 238, 0.18);
  color: #6cc7f5;
  font-weight: 600;
  font-size: 0.78rem;
}

.tg__plane {
  position: absolute;
  right: 0;
  bottom: -0.5rem;
  width: 44px;
  fill: #2aabee;
  opacity: 0.25;
  transform: rotate(-12deg);
  transition: transform 0.6s var(--ease-out), opacity 0.4s;

  .tile:hover & { transform: translate(8px, -10px) rotate(-12deg); opacity: 0.6; }
}

/* ── Numbers tile ──────────────────── */
.bento__nums {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-radius: 24px;
  background: var(--accent);
  color: var(--accent-ink);
  overflow: hidden;
}

.num {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  padding: clamp(1.25rem, 2vw, 1.75rem);

  & + & { border-left: 1px solid rgba(10, 10, 11, 0.15); }
}

.num__value {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(3rem, 6vw, 5.5rem);
  line-height: 0.9;
  letter-spacing: -0.06em;
}

.num__label {
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.3;
}
</style>
