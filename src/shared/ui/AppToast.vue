<template>
  <Transition name="toast">
    <div v-if="message" class="toast" role="status">{{ message }}</div>
  </Transition>
</template>

<script setup lang="ts">
import { useToast } from '@/shared/composables/useToast.ts'

const { message } = useToast()
</script>

<style scoped lang="scss">
.toast {
  position: fixed;
  left: 50%;
  bottom: 2rem;
  z-index: 9600;
  transform: translateX(-50%);
  padding: 0.8em 1.4em;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
}

.toast-enter-active, .toast-leave-active { transition: all 0.4s var(--ease-out); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>
