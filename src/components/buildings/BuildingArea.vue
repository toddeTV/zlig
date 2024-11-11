<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingArea.js'
import { Html } from '@tresjs/cientos'
import { computed } from 'vue'
import type { BuildingAreaId } from '@/game-logic/types.js'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent.js'
import type { Euler, Vector3 } from 'three'
import ConstructionSite from '../models/BuildArea.vue'
import ProgressBar from '../ui/ProgressBar.vue'
import ConstructingBehavior from './behaviors/ConstructingBehavior.vue'
import ProducingBehavior from './behaviors/ProducingBehavior.vue'
import UpgradingBehavior from './behaviors/UpgradingBehavior.vue'

const props = defineProps<{
  id: BuildingAreaId
  position: Vector3
  rotation: Euler
}>()

const gameState = useGameState()
const selectedBuildingArea = useSelectedBuildingArea()

const buildingInstance = computed(() => gameState.buildings[props.id])

function onClick(e: TresJsClickEvent) {
  e.stopPropagation()

  selectedBuildingArea.id = props.id
}

const positionsSiftedSlightlyUpwards = computed(() => {
  const position = props.position.clone()
  position.y += 0.5
  return position
})
</script>

<template>
  <ConstructingBehavior
    v-if="buildingInstance?.state === 'in-construction'"
    :area-id="props.id"
    :building-type="buildingInstance.type"
    :state="buildingInstance"
  />
  <UpgradingBehavior
    v-else-if="buildingInstance?.state === 'upgrading'"
    :area-id="props.id"
    :building-type="buildingInstance.type"
    :state="buildingInstance"
  />
  <ProducingBehavior
    v-else-if="buildingInstance?.state === 'producing'"
    :area-id="props.id"
    :building-type="buildingInstance.type"
    :state="buildingInstance"
  />

  <TresGroup
    :name="`building-area-${props.id}`"
    @click="(e: TresJsClickEvent) => onClick(e)"
  >
    <component
      :is="buildingInstance.type.levelProgression.getModelForLevel(buildingInstance.level)"
      v-if="buildingInstance?.state !== 'in-construction' && buildingInstance"
      :building-area-id="props.id"
      :building-instance
      :position="props.position"
      :rotation="props.rotation"
    />
    <ConstructionSite
      v-else
      :building-area-id="props.id"
      :position="props.position"
      :rotation="props.rotation"
    />

    <Html
      v-if="buildingInstance?.state === 'in-construction' || buildingInstance?.state === 'upgrading'"
      center
      :position="positionsSiftedSlightlyUpwards"
    >
      <div class="text-[30%] w-full h-full">
        <ProgressBar
          :max="buildingInstance.initialDuration.milliseconds.toNumber()"
          min="0"
          :value="buildingInstance.durationRemaining.milliseconds.toNumber()"
        />
      </div>
    </Html>
  </TresGroup>
</template>
