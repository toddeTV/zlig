<script setup lang="ts">
import ProgressBar from '@/components/ui/ProgressBar.vue'
import useGameState from '@/composables/useGameState.js'
import type { BuildingAreaId, BuildingStateInConstruction, BuildingType } from '@/game-logic/types.js'
import BasePopupWrapper from './BasePopupWrapper.vue'

const props = defineProps<{
  areaId: BuildingAreaId
  buildingType: BuildingType
  state: BuildingStateInConstruction
}>()

const gameState = useGameState()

// TODO: Factor in modifiers.
const totalBuildingDuration = props.buildingType.levelProgression.getBaseBuildingDurationForLevel(1)

function cancelBuild() {
  gameState.buildings[props.areaId] = undefined
}
</script>

<template>
  <BasePopupWrapper :title="`${props.buildingType.name} in construction`">
    <div class="flex flex-col gap-2">
      <p class="flex items-center gap-2">
        <span>Remaining:</span>

        <ProgressBar
          :max="totalBuildingDuration.milliseconds.toNumber()"
          :min="0"
          :value="props.state.durationRemaining.milliseconds.toNumber()"
        />

        <span>{{ props.state.durationRemaining.format() }} (game time)</span>
      </p>

      <p>
        <button
          class="border p-1 rounded"
          @click="() => cancelBuild()"
        >
          cancel build
        </button>
      </p>
    </div>
  </BasePopupWrapper>
</template>
