import { ref } from 'vue'

// Один глобальный тост — на лендинге больше и не нужно
const message = ref('')
let timer = 0

export function useToast() {
  function show(text: string, ms = 2000) {
    message.value = text
    window.clearTimeout(timer)
    timer = window.setTimeout(() => { message.value = '' }, ms)
  }

  return { message, show }
}
