<script setup lang="ts">
import { NoToneMapping, SRGBColorSpace, VSMShadowMap } from 'three'
import { TresCanvas } from '@tresjs/core'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'
import Game from '@/components/Game.vue'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'
import useClickedModelNodeStore from '@/composables/useSelectedModelsStore'

const clickedModelNodeStore = useClickedModelNodeStore()
const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

const gl: TresCanvasProps = {
  alpha: false,
  clearColor: '#82DBC5',
  disableRender: true, // Disable render on requestAnimationFrame, useful for PostProcessing // TODO use or not?
  outputColorSpace: SRGBColorSpace,
  renderMode: 'always',
  shadowMapType: VSMShadowMap, // TODO use another shadow type? BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | VSMShadowMap
  shadows: true,
  toneMapping: NoToneMapping,
  useLegacyLights: false, // TODO use or not?
}
</script>

<template>
  <TresCanvas
    v-bind="gl"
    @pointer-missed="() => clickedModelNodeStore.unselect()"
  >
    <Game />
  </TresCanvas>

  <div class="absolute top-0 left-0 z-20 flex flex-col gap-4">
    <div class="bg-red-200 p-2">
      registered:
      <pre>{{ Array.from(registeredForSelectingModelStore.getRegisteredAll).map(e => `ID ${e}`) }}</pre>
    </div>
    <div class="bg-red-200 p-2">
      selected:
      <pre>{{ clickedModelNodeStore.getSelected?.id ?? '-' }}</pre>
    </div>
    <div class="bg-red-200 p-2">
      move selected:<br>
      <button
        class="bg-blue-200 py-1 px-2 rounded-md"
        @click="() => {
          if (clickedModelNodeStore.hasSelected()){
            clickedModelNodeStore.getSelected!.position.x += 0.1
          }
        }"
      >
        move
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
