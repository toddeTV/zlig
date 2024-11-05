<script setup lang="ts">
import ProgressBar from '@/components/ui/ProgressBar.vue'
import useGameState from '@/composables/useGameState.js'
import type { BuildingLotId, BuildingStateInConstruction, BuildingType } from '@/game-logic/types.js'
import BasePopupWrapper from './BasePopupWrapper.vue'

const props = defineProps<{
  lotId: BuildingLotId
  buildingType: BuildingType
  state: BuildingStateInConstruction
}>()

const gameState = useGameState()

// TODO: Factor in modifiers.
const totalBuildingSeconds = props.buildingType.levelProgression.getBaseBuildingSecondsForLevel(1)

function cancelBuild() {
  gameState.buildings[props.lotId] = undefined
}
</script>

<template>
  <BasePopupWrapper :title="`${props.buildingType.name} in construction`">
    <div class="flex flex-col gap-2">
      <p class="flex items-center gap-2">
        <span>Remaining:</span>

        <ProgressBar
          :max="totalBuildingSeconds.toNumber()"
          :min="0"
          :value="props.state.secondsRemaining.toNumber()"
        />

        <span>{{ props.state.secondsRemaining.round().toNumber().toLocaleString() }} s</span>
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
