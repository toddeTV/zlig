<script setup lang="ts">
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'
import { TresCanvas } from '@tresjs/core'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'
import Game from '@/components/Game.vue'
import useClickedModelNodeStore from '@/composables/useSelectedModelsStore'

const clickedModelNodeStore = useClickedModelNodeStore()

const gl: TresCanvasProps = {
  alpha: false,
  clearColor: '#82DBC5',
  disableRender: true, // Disable render on requestAnimationFrame, useful for PostProcessing // TODO use or not?
  outputColorSpace: SRGBColorSpace,
  renderMode: 'always',
  shadowMapType: BasicShadowMap, // TODO use another shadow type?
  shadows: true,
  toneMapping: NoToneMapping,
  useLegacyLights: false, // TODO use or not?
}
</script>

<template>
  <TresCanvas
    v-bind="gl"
    @pointer-missed="() => clickedModelNodeStore.unselectAll()"
  >
    <Game />
  </TresCanvas>

  <div class="absolute top-0 left-0 bg-red-200 z-20 p-4">
    <pre>{{ clickedModelNodeStore.getSelectedAll().map(e => `ID ${e.id}`) }}</pre>
  </div>
</template>

<style scoped>
</style>
