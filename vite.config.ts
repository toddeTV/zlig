import { fileURLToPath, URL } from 'node:url'
// eslint-disable-next-line import/extensions
import ui from '@nuxt/ui/vite'
// eslint-disable-next-line import/extensions
import gltf from '@todde.tv/gltf-type-toolkit/vite'
import { templateCompilerOptions } from '@tresjs/core'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ // from `vue`
      ...templateCompilerOptions,
    }),
    vueDevTools(), // from `vite-plugin-vue-devtools`
    gltf({ // from `@todde.tv/gltf-type-toolkit`
      customGltfLoaderModule: '@/utils/gltfLoader.ts',
      verbose: true,
    }),
    ui({ // from `@nuxt/ui` (including `unplugin-vue-components` & `unplugin-auto-import` & `tailwindcss`)
      autoImport: { // from `unplugin-auto-import`
        imports: [ // global imports to register
          'vue', // preset
          'vue-router', // preset
        ],
      },
      colorMode: false,
      components: { // from `unplugin-vue-components`
      },
      ui: {
        colors: {
          // neutral: 'slate',
          // primary: 'green',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
