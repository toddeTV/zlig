import { fileURLToPath, URL } from 'node:url'
import { templateCompilerOptions } from '@tresjs/core'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { gltf } from './tools/vite-plugin-gltf.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      ...templateCompilerOptions,
    }),
    vueDevTools(),
    gltf(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
