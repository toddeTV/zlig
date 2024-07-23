<script setup lang="ts">
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'
import { type DomEvent, type ThreeEvent, TresCanvas, useTresContext, useTresContextProvider } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'
import { EffectComposer, Outline } from '@tresjs/post-processing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { computed } from 'vue'
import useClickedModelNodeStore from '@/composables/useClickedModelNodeStore'
import Bridge from '@/components/models/Bridge.vue'
import BambooBehindFence from '@/components/models/BambooBehindFence.vue'
import Untitled from '@/components/models/Untitled.vue'

const clickedModelNodeStore = useClickedModelNodeStore()

const { scene } = useTresContext()

const activeObjects = computed(() => {
  const selectedObjects = clickedModelNodeStore.activeIds.map(id => scene.value.getObjectById(id))
  const nonUndefinedSelectedObjects = selectedObjects.filter((element) => {
    return element !== undefined
  })
  return nonUndefinedSelectedObjects
})

function onNodeClick(
  event: ThreeEvent<DomEvent> & Event,
) {
  // the click was on the model and the raycaster hit a node, so we do not send the raycast any further
  event.stopPropagation()

  // store the clicked model node
  clickedModelNodeStore.activeIds = [event.eventObject.id]
}
</script>

<template>
  <!-- visual helper -->
  <!-- <TresAxesHelper /> -->
  <!-- <TresGridHelper /> -->

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
  <!-- <TresGroup>
    <Suspense>
      <Bridge
        :position="[0, 0, 0]"
        @click="(event) => onNodeClick(event)"
      />
    </Suspense>
    <Suspense>
      <BambooBehindFence
        :position="[4, 0, 0]"
        @click="(event) => onNodeClick(event)"
      />
    </Suspense>
    <Suspense>
      <BambooBehindFence
        :position="[4, 0, 2]"
        @click="(event) => onNodeClick(event)"
      />
    </Suspense>
  </TresGroup> -->

  <Suspense>
    <Untitled
      :position="[0, 0, -2]"
      @click="(event) => onNodeClick(event)"
    />
  </Suspense>
  <Suspense>
    <Untitled
      :position="[0, 0, 2]"
      @click="(event) => onNodeClick(event)"
    />
  </Suspense>

  <!-- effects -->
  <Suspense>
    <EffectComposer :multisampling="8">
      <Outline
        :blend-function="BlendFunction.ALPHA"
        :blur="false"
        :edge-strength="5"
        hidden-edge-color="#000000"
        :outlined-objects="activeObjects"
        :pulse-speed="0"
        visible-edge-color="#000000"
      />
    </EffectComposer>
  </Suspense>
</template>

<style scoped>
</style>
