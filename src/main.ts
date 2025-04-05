import router from '@/router/index.js'
// eslint-disable-next-line import/extensions
import ui from '@nuxt/ui/vue-plugin'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ui)

app.mount('#app')
