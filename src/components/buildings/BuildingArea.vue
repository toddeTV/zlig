<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingAreaStore.js'
import { Html } from '@tresjs/cientos'
import { storeToRefs } from 'pinia'
import { Vector3 } from 'three'
import { computed } from 'vue'
import type { BuildingAreaId } from '@/game-logic/types.js'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent.js'
import type { Euler } from 'three'
import ConstructionSite from '../models/BuildArea.vue'
import ProgressBar from '../ui/ProgressBar.vue'
import ConstructingBehavior from './behaviors/ConstructingBehavior.vue'
import ProducingBehavior from './behaviors/ProducingBehavior.vue'
import UpgradingBehavior from './behaviors/UpgradingBehavior.vue'
import BuildingPopupConstruction from './popup/BuildingPopupConstruction.vue'
import BuildingPopupEmpty from './popup/BuildingPopupEmpty.vue'
import BuildingPopupProducing from './popup/BuildingPopupProducing.vue'
import BuildingPopupUpgrading from './popup/BuildingPopupUpgrading.vue'

const props = defineProps<{
  id: BuildingAreaId
  position: Vector3
  rotation: Euler
}>()

const gameState = useGameState()
const { id: selectedBuildAreaId } = storeToRefs(useSelectedBuildingArea())

const buildingInstance = computed(() => gameState.buildings[props.id])
const isSelected = computed(() => selectedBuildAreaId.value === props.id)

function onClick(e: TresJsClickEvent) {
  e.stopPropagation()

  selectedBuildAreaId.value = props.id
}

function getPopupHeightOffset() {
  // TODO: Somehow calculate this offset to display the popup ABOVE the object on the screen.
  // Right now this is hardcoded so that it looks OK.

  if (buildingInstance.value?.state === 'in-construction') {
    return 7
  }

  if (buildingInstance.value?.state === 'upgrading') {
    return 10
  }

  if (buildingInstance.value?.state === 'producing') {
    return 18
  }

  return 15
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
    <!-- TODO fix multiple use of `<ConstructionSite` -->
    <ConstructionSite
      v-if="buildingInstance?.state === 'in-construction'"
      :building-area-id="props.id"
      :position="props.position"
      :rotation="props.rotation"
    />
    <component
      :is="buildingInstance.type.levelProgression.getModelForLevel(buildingInstance.level)"
      v-else-if="buildingInstance"
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
      v-if="isSelected"
      center
      :position="new Vector3(0, getPopupHeightOffset(), 0).add(props.position)"
    >
      <BuildingPopupConstruction
        v-if="buildingInstance?.state === 'in-construction'"
        :area-id="props.id"
        :building-type="buildingInstance.type"
        :state="buildingInstance"
      />
      <BuildingPopupUpgrading
        v-else-if="buildingInstance?.state === 'upgrading'"
        :area-id="props.id"
        :building-type="buildingInstance.type"
        :state="buildingInstance"
      />
      <BuildingPopupProducing
        v-else-if="buildingInstance?.state === 'producing'"
        :area-id="props.id"
        :building-type="buildingInstance.type"
        :state="buildingInstance"
      />
      <BuildingPopupEmpty
        v-else
        :area-id="props.id"
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
