<script setup lang="ts">
import { NoToneMapping, SRGBColorSpace, VSMShadowMap } from 'three'
import { TresCanvas } from '@tresjs/core'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'
import Game from '@/components/Game.vue'
import useClickedModelNodeStore from '@/composables/useSelectedModelsStore'
import ClickedModelDebugUI from '@/components/ClickedModelDebugUI.vue'

const clickedModelNodeStore = useClickedModelNodeStore()

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

  <ClickedModelDebugUI />
</template>

<style scoped>
</style>
