<script setup lang="ts">
import { watch } from 'vue'
import { Vector3 } from 'three'
import Island from './models/Island.vue'
import VisualHelper from './VisualHelper.vue'
import CameraAndControls from './CameraAndControls.vue'
import Lights from './Lights.vue'
import DistanceFog from './DistanceFog.vue'
import BuildingLot from './buildings/BuildingLot.vue'
import useClickedModelNodeStore from '@/composables/useSelectedModelsStore'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'
import useBuildingLots from '@/composables/useBuildingLots.js'

const clickedModelNodeStore = useClickedModelNodeStore()
const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

const buildingLots = useBuildingLots()
buildingLots.init()

// import { useTresContext } from '@tresjs/core'

// const { scene } = useTresContext()

function onNodeClick(
  event: TresJsClickEvent,
) {
  // the raycaster hit a node/ model, so we do not send the raycast any further down
  event.stopPropagation()

  // toggle the model selection if the model is registered to be selectable
  if (registeredForSelectingModelStore.isRegistered(event.object)) {
    clickedModelNodeStore.toggle(event.object)
    return
  }

  // unselect all models if the raycaster hits a model that is not registered to be selectable
  clickedModelNodeStore.unselect()
}
</script>

<template>
  <VisualHelper />
  <CameraAndControls />
  <Lights />
  <DistanceFog />

  <TresGroup
    @click="(e) => onNodeClick(e)"
  >
    <Suspense>
      <Island
        :position="[0, 0, 0]"
      />
    </Suspense>

    <Suspense>
      <BuildingLot
        v-for="lot in buildingLots.lots"
        :id="lot.id"
        :key="lot.id"
        :position="lot.position"
      />
    </Suspense>
  </TresGroup>
</template>

<style scoped>
</style>
