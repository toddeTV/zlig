<script setup lang="ts">
import GameEngine from '@/components/GameEngine.vue'
import { TresCanvas } from '@tresjs/core'
import { NoToneMapping, SRGBColorSpace, VSMShadowMap } from 'three'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'

const gl = ref<TresCanvasProps>({
  alpha: false,
  antialias: false,
  // clearColor: 'transparent',
  clearColor: '#ffffff',
  // disableRender: true, // Disable render on requestAnimationFrame, useful for old PostProcessing // TODO use or not?
  outputColorSpace: SRGBColorSpace,
  renderMode: 'always',
  // resize: true, // not present? hmm ... documentation says it's there and important for resizable canvas - weird
  // `VSMShadowMap` better shadows, but more performance heavy; `BasicShadowMap` is faster but has less quality
  shadowMapType: VSMShadowMap, // BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | VSMShadowMap
  shadows: true,
  toneMapping: NoToneMapping,
  useLegacyLights: false,
})
</script>

<!-- @pointer-missed="() => firePointerMissedEvent()" -->
<template>
  <!-- will create the dom `canvas` -->
  <TresCanvas
    v-bind="gl"
  >
    <GameEngine />
  </TresCanvas>
</template>

<style scoped>
</style>
