<script setup lang="ts">
import BasePopupWrapper from './BasePopupWrapper.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import useGameState from '@/composables/useGameState.js'
import type { BuildingLotId, BuildingStateUpgrading, BuildingType } from '@/game-logic/buildings/types.js'
import { ResourceRecord } from '@/game-logic/resources.js'

const props = defineProps<{
  lotId: BuildingLotId
  buildingType: BuildingType
  state: BuildingStateUpgrading
}>()

const gameState = useGameState()

// TODO: Factor in modifiers.
const totalBuildingSeconds = props.buildingType.levelProgression.getBaseBuildingSecondsForLevel(props.state.level + 1)

function cancelUpgrade() {
  gameState.buildings[props.lotId] = {
    // TODO: Approve that it is ok to loose progress when canceling an upgrade.
    internalBuffer: new ResourceRecord(),
    level: props.state.level,
    state: 'producing',
    type: props.buildingType,
  }
}
</script>

<template>
  <BasePopupWrapper :title="`Upgrading ${props.buildingType.name}`">
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
          @click="() => cancelUpgrade()"
        >
          cancel upgrade
        </button>
      </p>
    </div>
  </BasePopupWrapper>
</template>
