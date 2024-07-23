<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
// import { EffectComposer, Outline } from '@tresjs/post-processing'
// import { BlendFunction } from 'postprocessing'
// import { computed } from 'vue'
import useClickedModelNodeStore from '@/composables/useClickedModelNodeStore'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent'
import Bridge from '@/components/models/Bridge.vue'
import BambooBehindFence from '@/components/models/BambooBehindFence.vue'

const clickedModelNodeStore = useClickedModelNodeStore()

// const { scene } = useTresContext()

// const activeObjects = computed(() => {
//   const selectedObjects = clickedModelNodeStore.activeIds.map(id => scene.value.getObjectById(id))
//   const nonUndefinedSelectedObjects = selectedObjects.filter((element) => {
//     return element !== undefined
//   })
//   return nonUndefinedSelectedObjects
// })

function onNodeClick(
  event: TresJsClickEvent,
) {
  // the click was on the model and the raycaster hit a node, so we do not send the raycast any further
  event.stopPropagation()

  // remove current selection if it currently is selected
  if (clickedModelNodeStore.activeIds.includes(event.eventObject.id)) {
    clickedModelNodeStore.activeIds = clickedModelNodeStore.activeIds.filter(id => id !== event.eventObject.id)
    return
  }

  // add the clicked model node to the selected nodes
  clickedModelNodeStore.activeIds = [event.eventObject.id]
}
</script>

<template>
  <!-- visual helper -->
  <TresAxesHelper />
  <TresGridHelper />

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
      <Bridge
        :position="[0, 0, 0]"
        @click="(event: TresJsClickEvent) => onNodeClick(event)"
      />
    </Suspense>
    <Suspense>
      <BambooBehindFence
        :position="[4, 0, 0]"
        @click="(event: TresJsClickEvent) => onNodeClick(event)"
      />
    </Suspense>
    <Suspense>
      <BambooBehindFence
        :position="[4, 0, 2]"
        @click="(event: TresJsClickEvent) => onNodeClick(event)"
      />
    </Suspense>
  </TresGroup>

  <!-- effects -->
  <!-- <Suspense>
    <EffectComposer>
      <Outline
        :blend-function="BlendFunction.ALPHA"
        :blur="false"
        :edge-strength="5"
        hidden-edge-color="#32a852"
        :multisampling="8"
        :outlined-objects="activeObjects"
        :pulse-speed="2"
        visible-edge-color="#bd3758"
      />
    </EffectComposer>
  </Suspense> -->
</template>

<style scoped>
</style>
