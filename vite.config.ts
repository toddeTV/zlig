import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
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
    ui({ // from `@nuxt/ui`
      colorMode: false,
      components: { // from `unplugin-vue-components` (is contained in `@nuxt/ui`)
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
