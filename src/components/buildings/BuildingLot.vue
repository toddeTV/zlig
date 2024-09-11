<script setup lang="ts">
import { Html } from '@tresjs/cientos'
import Big from 'big.js'
import { Vector3 } from 'three'
import { computed } from 'vue'
import modelLoader from '@/assets/models/Island/Island.gltf'
import useGameState from '@/composables/useGameState.js'
import useSelectedBuildingLot from '@/composables/useSelectedBuildingLot.js'
import { buildingTypes } from '@/game-logic/buildings/index.js'
import type { BuildingLotId } from '@/game-logic/buildings/types.js'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent.js'

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
      :position="new Vector3(0, 3, 0).add(props.position)"
    >
      <h1 class="bg-white dark:bg-dark p-1 rounded w-[100px]" @click="console.log">
        I'm a Box 📦
      </h1>
    </Html>
  </TresGroup>
</template>
