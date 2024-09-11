<script setup lang="ts">
import { Html } from '@tresjs/cientos'
import { Vector3 } from 'three'
import { computed } from 'vue'
import ConstructionSite from '../models/buildings/ConstructionSite.vue'
import ProgressBar from '../ui/ProgressBar.vue'
import ConstructingBehavior from './behaviors/ConstructingBehavior.vue'
import BuildingPopupConstruction from './popup/BuildingPopupConstruction.vue'
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

function getPopupHeightOffset() {
  // TODO: Somehow calculate this offset to display the popup ABOVE the object on the screen.
  // Right now this is hardcoded so that it looks OK.

  if (buildingInstance.value?.state === 'in-construction') {
    return 3.5
  }

  return 7.5
}
</script>

<template>
  <ConstructingBehavior
    v-if="buildingInstance?.state === 'in-construction'"
    :building-type="buildingInstance.type"
    :lot-id="props.id"
    :state="buildingInstance"
  />

  <TresGroup @click="onClick">
    <component
      :is="buildingInstance.type.levelProgression.getModelForLevel(buildingInstance.level)"
      v-if="buildingInstance && buildingInstance.state !== 'in-construction'"
      :building-instance
      :position="props.position"
    />
    <ConstructionSite
      v-else-if="buildingInstance?.state === 'in-construction'"
      :position="props.position"
    />
    <primitive
      v-else
      :object="Scene.Object[props.id as keyof typeof Scene.Object]"
    />

    <Html
      v-if="isSelected"
      center
      :position="new Vector3(0, getPopupHeightOffset(), 0).add(props.position)"
    >
      <BuildingPopupConstruction
        v-if="buildingInstance?.state === 'in-construction'"
        :building-type="buildingInstance.type"
        :lot-id="props.id"
        :state="buildingInstance"
      />
      <BuildingPopupEmpty
        v-else
        :lot-id="props.id"
      />
    </Html>

    <Html
      v-else-if="buildingInstance?.state === 'in-construction' || buildingInstance?.state === 'upgrading'"
      center
      :position="props.position"
    >
      <div class="text-[30%]">
        <ProgressBar
          :max="
            // TODO: Factor in modifiers.
            buildingInstance.type.levelProgression.getBaseBuildingSecondsForLevel(buildingInstance.level + 1).toNumber()
          "
          :min="0"
          :value="buildingInstance.secondsRemaining.toNumber()"
        />
      </div>
    </Html>
  </TresGroup>
</template>
