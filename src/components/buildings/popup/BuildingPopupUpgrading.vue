<script setup lang="ts">
import ProgressBar from '@/components/ui/ProgressBar.vue'
import useGameState from '@/composables/useGameState.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import type { BuildingAreaId, BuildingStateUpgrading, BuildingType } from '@/game-logic/types.js'
import BasePopupWrapper from './BasePopupWrapper.vue'

const props = defineProps<{
  areaId: BuildingAreaId
  buildingType: BuildingType
  state: BuildingStateUpgrading
}>()

const gameState = useGameState()

function cancelUpgrade() {
  gameState.buildings[props.areaId] = {
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
          :max="props.state.initialSeconds.toNumber()"
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
