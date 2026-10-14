import { computed, ref } from 'vue'
import { PROJECTS } from '../data.ts'
import type { ProjectId } from '../types.ts'

/*
 * Открытый кейс живёт в адресе: #work/hashar — ссылкой можно поделиться,
 * а кнопка «Назад» в браузере закрывает оверлей.
 */

const HASH_PREFIX = '#work/'
const openId = ref<ProjectId | null>(null)

function parseHash(): ProjectId | null {
  const id = location.hash.startsWith(HASH_PREFIX) ? location.hash.slice(HASH_PREFIX.length) : ''
  return PROJECTS.find((p) => p.id === id)?.id ?? null
}

export function useCaseView() {
  const index = computed(() => PROJECTS.findIndex((p) => p.id === openId.value))
  const project = computed(() => PROJECTS[index.value] ?? null)
  const nextProject = computed(() => PROJECTS[(index.value + 1) % PROJECTS.length] ?? null)

  function openCase(id: ProjectId) {
    const url = `${HASH_PREFIX}${id}`
    // Переход между кейсами не плодит записи в истории
    if (openId.value) history.replaceState({ case: true }, '', url)
    else history.pushState({ case: true }, '', url)
    openId.value = id
  }

  function closeCase() {
    if (!openId.value) return
    openId.value = null
    if (history.state?.case) history.back()
    else history.replaceState(null, '', location.pathname + location.search)
  }

  return { openId, index, project, nextProject, openCase, closeCase }
}

// Подключается один раз (в CaseOverlay): начальный hash + кнопки истории
export function syncCaseWithHistory() {
  openId.value = parseHash()
  const onPop = () => { openId.value = parseHash() }
  window.addEventListener('popstate', onPop)
  return () => window.removeEventListener('popstate', onPop)
}
