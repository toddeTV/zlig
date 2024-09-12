<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import useGameState from '@/composables/useGameState.js'
import useSelectedBuildingLot from '@/composables/useSelectedBuildingLot.js'
import { Html } from '@tresjs/cientos'
import { Vector3 } from 'three'
import { computed } from 'vue'
import type { BuildingLotId } from '@/game-logic/buildings/types.js'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent.js'
import ConstructionSite from '../models/buildings/ConstructionSite.vue'
import ProgressBar from '../ui/ProgressBar.vue'
import ConstructingBehavior from './behaviors/ConstructingBehavior.vue'
import ProducingBehavior from './behaviors/ProducingBehavior.vue'
import UpgradingBehavior from './behaviors/UpgradingBehavior.vue'
import BuildingPopupConstruction from './popup/BuildingPopupConstruction.vue'
import BuildingPopupEmpty from './popup/BuildingPopupEmpty.vue'
import BuildingPopupProducing from './popup/BuildingPopupProducing.vue'
import BuildingPopupUpgrading from './popup/BuildingPopupUpgrading.vue'

const props = defineProps<{
  id: BuildingLotId
  position: Vector3
}>()

const { scenes: { Island } } = await modelLoader

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

  if (buildingInstance.value?.state === 'upgrading') {
    return 5
  }

  if (buildingInstance.value?.state === 'producing') {
    return 9
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
  <UpgradingBehavior
    v-else-if="buildingInstance?.state === 'upgrading'"
    :building-type="buildingInstance.type"
    :lot-id="props.id"
    :state="buildingInstance"
  />
  <ProducingBehavior
    v-else-if="buildingInstance?.state === 'producing'"
    :building-type="buildingInstance.type"
    :lot-id="props.id"
    :state="buildingInstance"
  />

  <TresGroup @click="(e: TresJsClickEvent) => onClick(e)">
    <ConstructionSite
      v-if="buildingInstance?.state === 'in-construction'"
      :position="props.position"
    />
    <component
      :is="buildingInstance.type.levelProgression.getModelForLevel(buildingInstance.level)"
      v-else-if="buildingInstance"
      :building-instance
      :position="props.position"
    />
    <primitive
      v-else
      :object="Island.Object[props.id as keyof typeof Island.Object]"
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
      <BuildingPopupUpgrading
        v-else-if="buildingInstance?.state === 'upgrading'"
        :building-type="buildingInstance.type"
        :lot-id="props.id"
        :state="buildingInstance"
      />
      <BuildingPopupProducing
        v-else-if="buildingInstance?.state === 'producing'"
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
