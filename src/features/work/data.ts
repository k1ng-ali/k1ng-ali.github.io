import type { ArchiveItem, Project } from './types.ts'

// Тексты проектов — в i18n: work.items.<id>.*
export const PROJECTS: Project[] = [
  {
    id: 'hashar',
    shots: { desktop: 'work/hashar-desktop.png', mobile: 'work/hashar-mobile.png' },
    year: '2026',
    tint: '#08130d',
    accent: '#34d27b',
    stack: ['Vue 3', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Docker'],
    visual: 'hashar',
    live: 'https://hashar.app',
    repo: 'https://github.com/k1ng-ali/hashar-app',
  },
  {
    id: 'dovtalab',
    shots: { desktop: 'work/dovtalab-desktop.png', mobile: 'work/dovtalab-mobile.png' },
    year: '2024 — 26',
    tint: '#08151c',
    accent: '#4ebec2',
    stack: ['Vue 3', 'Pinia', 'FastAPI', 'Aiogram', 'WebSocket'],
    visual: 'dovtalab',
    live: 'https://dovtalab.app',
    repo: 'https://github.com/k1ng-ali/dovtalab',
  },
  {
    id: 'pos',
    shots: { desktop: 'work/cafe-pos-desktop.png', mobile: 'work/cafe-pos-mobile.png' },
    year: '2026',
    tint: '#14110a',
    accent: '#f2c46d',
    stack: ['Vue 3', 'Tailwind', 'Web Crypto'],
    visual: 'pos',
    live: 'https://mukhammadali.me/Cafe-POS/',
    repo: 'https://github.com/k1ng-ali/Cafe-POS',
  },
  {
    id: 'kamol',
    shots: { desktop: 'work/kamol-desktop.png', mobile: 'work/kamol-mobile.png' },
    year: '2026',
    tint: '#140f0a',
    accent: '#d48c55',
    stack: ['Vue 3', 'TypeScript', 'SCSS'],
    visual: 'browser',
    domain: 'kamol-building',
    live: 'https://mukhammadali.me/kamol-building/',
    repo: 'https://github.com/k1ng-ali/kamol-building',
  },
  {
    id: 'somoni',
    shots: { desktop: 'work/somon-desktop.png', mobile: 'work/somon-mobile.png' },
    year: '2026',
    tint: '#150c06',
    accent: '#ff6b1a',
    stack: ['Vue 3', 'vue-router', 'SCSS'],
    visual: 'browser',
    domain: 'somoni-tj',
    live: 'https://mukhammadali.me/somoni-tj/',
    repo: 'https://github.com/k1ng-ali/somoni-tj',
  },
]

// Тексты — в i18n: archive.items.<id>.*
export const ARCHIVE: ArchiveItem[] = [
  {
    id: 'itt',
    year: '2026',
    stack: ['Vue 3', 'TypeScript', 'GSAP'],
    thumb: 'projects/it-tajikistan.png',
    href: 'https://it-tajikistan.dcn.tj/',
  },
  {
    id: 'umed',
    year: '2026',
    stack: ['Vue 3', 'TypeScript'],
    thumb: 'projects/chashmai-umed.png',
    href: 'https://mukhammadali.me/Chashmai-Umed/',
  },
  {
    id: 'bot',
    year: '2024',
    stack: ['Python', 'Aiogram'],
    thumb: 'projects/dovtalab-banner.png',
    href: 'https://github.com/k1ng-ali/Dovtalab_Bot',
  },
]
