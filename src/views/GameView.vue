<script setup lang="ts">
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'
import Bridge from '@/components/models/Bridge.vue'
import BambooBehindFence from '@/components/models/BambooBehindFence.vue'

const gl: TresCanvasProps = {
  alpha: false,
  clearColor: '#82DBC5',
  outputColorSpace: SRGBColorSpace,
  renderMode: 'always',
  shadowMapType: BasicShadowMap, // TODO use another shadow type?
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
    <TresDirectionalLight
      cast-shadow
      :intensity="1.2"
      :position="[0, 2, 4]"
    />
    <TresAmbientLight :intensity="0.3" />

    <!-- objects -->
    <TresGroup>
      <Suspense>
        <Bridge :position="[0, 0, 0]" />
      </Suspense>
      <Suspense>
        <BambooBehindFence :position="[4, 0, 0]" />
      </Suspense>
    </TresGroup>
  </TresCanvas>
</template>

<style scoped>
</style>
