import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from '@/shared/i18n'
import 'lenis/dist/lenis.css'
import './styles/global.scss'

createApp(App).use(i18n).mount('#app')
