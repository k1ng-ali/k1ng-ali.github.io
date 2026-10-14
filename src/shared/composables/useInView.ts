import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

// true, пока элемент в зоне видимости — живые анимации крутятся только тогда
export function useInView(el: Ref<HTMLElement | null>, rootMargin = '0px') {
  const inView = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!el.value) return
    observer = new IntersectionObserver(([entry]) => {
      inView.value = entry?.isIntersecting ?? false
    }, { rootMargin })
    observer.observe(el.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return inView
}
