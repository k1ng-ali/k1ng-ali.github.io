export type ProjectId = 'hashar' | 'dovtalab' | 'pos' | 'kamol' | 'somoni'

// hashar / dovtalab / pos — интерактивные макеты, browser — скриншот в окне браузера
export type ProjectVisual = 'hashar' | 'dovtalab' | 'pos' | 'browser'

export interface Project {
  id: ProjectId
  year: string
  tint: string        // фон секции, пока проект в фокусе
  accent: string      // фирменный цвет проекта
  stack: string[]
  visual: ProjectVisual
  repo: string
  live?: string
  shots: { desktop: string; mobile: string }   // пути в public/
  domain?: string     // подпись в адресной строке макета
}

export interface ArchiveItem {
  id: 'itt' | 'umed' | 'bot'
  year: string
  stack: string[]
  thumb: string
  href: string
}
