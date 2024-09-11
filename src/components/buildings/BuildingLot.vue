<script setup lang="ts">
import { Html } from '@tresjs/cientos'
import { Vector3 } from 'three'
import { computed } from 'vue'
import BuildingPopupEmpty from './popup/BuildingPopupEmpty.vue'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent.js'
import type { BuildingLotId } from '@/game-logic/buildings/types.js'
import useSelectedBuildingLot from '@/composables/useSelectedBuildingLot.js'
import useGameState from '@/composables/useGameState.js'
import modelLoader from '@/assets/models/Island/Island.gltf'

const props = defineProps<{
  id: BuildingLotId
  position: Vector3
}>()

const { scenes: { Scene } } = await modelLoader

const gameState = useGameState()
const selectedBuildingLot = useSelectedBuildingLot()

const buildingInstance = computed(() => gameState.buildings[props.id])
const isSelected = computed(() => selectedBuildingLot.id === props.id)

function onClick(e: TresJsClickEvent) {
  e.stopPropagation()

  selectedBuildingLot.id = props.id
}
</script>

<template>
  <TresGroup @click="onClick">
    <component
      :is="buildingInstance.type.levelProgression.getModelForLevel(buildingInstance.level)"
      v-if="buildingInstance"
      :building-instance
      :position="props.position"
    />
    <primitive v-else :object="Scene.Object[props.id as keyof typeof Scene.Object]" />

    <Html
      v-if="isSelected"
      center
      :position="new Vector3(0,
                             // TODO: Somehow calculate this offset to display the popup ABOVE the object on the screen.
                             // Right now this is hardcoded so that it looks OK.
                             7.5,
                             0).add(props.position)"
    >
      <BuildingPopupEmpty
        :lot-id="props.id"
      />
    </Html>
  </TresGroup>
</template>
