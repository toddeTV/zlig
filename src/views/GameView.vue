<script setup lang="ts">
import DebugOverlay from '@/components/DebugOverlay.vue'
import GameEngine from '@/components/GameEngine.vue'
import useClickedModelNodeStore from '@/composables/useSelectedModelsStore'
import { TresCanvas } from '@tresjs/core'
import { NoToneMapping, SRGBColorSpace, VSMShadowMap } from 'three'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'

const clickedModelNodeStore = useClickedModelNodeStore()

const gl: TresCanvasProps = {
  alpha: false,
  clearColor: '#82DBC5',
  disableRender: true, // Disable render on requestAnimationFrame, useful for PostProcessing // TODO use or not?
  outputColorSpace: SRGBColorSpace,
  renderMode: 'always',
  // `VSMShadowMap` better shadows, but more performance heavy; `BasicShadowMap` is faster but has less quality
  shadowMapType: VSMShadowMap, // BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | VSMShadowMap
  shadows: true,
  toneMapping: NoToneMapping,
  useLegacyLights: false,
}
</script>

<template>
  <div class="h-full overflow-hidden relative">
    <TresCanvas
      v-bind="gl"
      @pointer-missed="() => clickedModelNodeStore.unselect()"
    >
      <GameEngine />
    </TresCanvas>

    <DebugOverlay />
  </div>
</template>

<style scoped>
</style>
