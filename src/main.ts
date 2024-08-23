import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { startGameLoop } from '@/game-logic/index.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

startGameLoop()
