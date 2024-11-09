<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import useGameState from '@/composables/useGameState.js'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingArea.js'
import { Html } from '@tresjs/cientos'
import { computed } from 'vue'
import type { BuildingAreaId } from '@/game-logic/types.js'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent.js'
import type { Vector3 } from 'three'
import ConstructionSite from '../models/buildings/ConstructionSite.vue'
import ProgressBar from '../ui/ProgressBar.vue'
import ConstructingBehavior from './behaviors/ConstructingBehavior.vue'
import ProducingBehavior from './behaviors/ProducingBehavior.vue'
import UpgradingBehavior from './behaviors/UpgradingBehavior.vue'

const props = defineProps<{
  id: BuildingAreaId
  position: Vector3
}>()

const { scenes: { Island } } = await modelLoader

const gameState = useGameState()
const selectedBuildingArea = useSelectedBuildingArea()

const buildingInstance = computed(() => gameState.buildings[props.id])

function onClick(e: TresJsClickEvent) {
  e.stopPropagation()

  selectedBuildingArea.id = props.id
}
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
    <ConstructionSite
      v-if="buildingInstance?.state === 'in-construction'"
      :position="props.position"
    />
    <component
      :is="buildingInstance.type.levelProgression.getModelForLevel(buildingInstance.level)"
      v-else-if="buildingInstance"
      :building-area-id="props.id"
      :building-instance
      :position="props.position"
    />
    <primitive
      v-else
      :object="Island.Object[props.id as keyof typeof Island.Object]"
    />

    <Html
      v-if="buildingInstance?.state === 'in-construction' || buildingInstance?.state === 'upgrading'"
      center
      :position="props.position"
    >
      <div class="text-[30%]">
        <ProgressBar
          :max="buildingInstance.initialSeconds.toNumber()"
          min="0"
          :value="buildingInstance.secondsRemaining.toNumber()"
        />
      </div>
    </Html>
  </TresGroup>
</template>
