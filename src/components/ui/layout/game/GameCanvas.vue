<script setup lang="ts">
import GameEngine from '@/components/GameEngine.vue'
import useCalculatedLights from '@/composables/useCalculatedLights.js'
import { TresCanvas } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { NoToneMapping, SRGBColorSpace, VSMShadowMap } from 'three'
import { ref, watchEffect } from 'vue'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'

const { lightColors } = storeToRefs(useCalculatedLights())

const gl = ref<TresCanvasProps>({
  alpha: false,
  clearColor: '#82DBC5',
  disableRender: true, // Disable render on requestAnimationFrame, useful for PostProcessing // TODO use or not?
  outputColorSpace: SRGBColorSpace,
  renderMode: 'always',
  // resize: true, // not present? hmm ... documentation says it's there and important for resizable canvas - weird
  // `VSMShadowMap` better shadows, but more performance heavy; `BasicShadowMap` is faster but has less quality
  shadowMapType: VSMShadowMap, // BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | VSMShadowMap
  shadows: true,
  toneMapping: NoToneMapping,
  useLegacyLights: false,
})

watchEffect(() => {
  // set the sky color
  // @ts-expect-error //TODO this works, but it's not correctly typed -> check and fix
  gl.value.clearColor = lightColors.value.sky
})
</script>

<!-- @pointer-missed="() => firePointerMissedEvent()" -->
<template>
  <div
    class="w-full h-full flex-1 relative"
  >
    <!-- will create the dom `canvas` -->
    <TresCanvas
      v-bind="gl"
      class="absolute inset-0"
    >
      <GameEngine />
    </TresCanvas>
  </div>
</template>

<style scoped>
</style>
