<script setup lang="ts">
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'
import SM_Bridge_01 from '@/components/models/SM_Bridge_01.vue'
import SM_BambooBehindTheFence_01 from '@/components/models/SM_BambooBehindTheFence_01.vue'

const gl: TresCanvasProps = {
  alpha: false,
  clearColor: '#82DBC5',
  outputColorSpace: SRGBColorSpace,
  renderMode: 'on-demand', // TODO use or not?
  shadowMapType: BasicShadowMap,
  shadows: true,
  toneMapping: NoToneMapping,
  useLegacyLights: false, // TODO use or not?
}
</script>

<template>
  <TresCanvas v-bind="gl">
    <!-- camera -->
    <TresPerspectiveCamera :position="[9, 9, 9]" />

    <!-- controls -->
    <OrbitControls />

    <!-- lights -->
    <TresDirectionalLight :position="[0, 2, 4]" :intensity="1.2" cast-shadow />

    <!-- objects -->
    <Suspense>
      <SM_Bridge_01 :position="[0, 0, 0]" />
    </Suspense>
    <Suspense>
      <SM_BambooBehindTheFence_01 :position="[4, 0, 0]" />
    </Suspense>

    <!-- TODO currently needed so that the scene can be rotated - FIX! -->
    <TresMesh :position="[-2, 2, 0]" :rotation="[0, Math.PI, 0]">
      <TresConeGeometry :args="[0, 1, 1]" />
    </TresMesh>
  </TresCanvas>
</template>

<style scoped>
</style>
