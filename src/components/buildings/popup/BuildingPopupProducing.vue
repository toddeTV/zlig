<script setup lang="ts">
import Resources from '@/components/ui/Resources.vue'
import useGameState from '@/composables/useGameState.js'
import type { BuildingAreaId, BuildingStateProducing, BuildingType } from '@/game-logic/types.js'
import BasePopupWrapper from './BasePopupWrapper.vue'

const props = defineProps<{
  areaId: BuildingAreaId
  buildingType: BuildingType
  state: BuildingStateProducing
}>()

const gameState = useGameState()

function getCurrentIncome() {
  // TODO: Factor in modifiers.
  const income = props.buildingType.levelProgression.getBaseIncomeForLevel(props.state.level)

  return income
}

function getUpgradeCosts() {
  // TODO: Factor in modifiers.
  const costs = props.buildingType.levelProgression.getBaseCostsForLevel(props.state.level + 1)

  return costs
}

function getUpgradeBuildingSeconds() {
  // TODO: Factor in modifiers.
  const seconds = props.buildingType.levelProgression.getBaseBuildingSecondsForLevel(props.state.level + 1)

  return seconds
}

function getUpgradedIncome() {
  // TODO: Factor in modifiers.
  const income = props.buildingType.levelProgression.getBaseIncomeForLevel(props.state.level + 1)

  return income
}

function canUpgrade(): true | 'max-level' | 'no-resources' {
  if (props.buildingType.levelProgression.maxLevel && props.state.level >= props.buildingType.levelProgression.maxLevel) {
    return 'max-level'
  }

  if (!gameState.resources.gte(getUpgradeCosts())) {
    return 'no-resources'
  }

  return true
}

function upgrade() {
  if (canUpgrade() !== true) {
    // TODO: Display warning here? Actually, this is only a safety measure here as the click should not be possible.
    return
  }

  gameState.resources = gameState.resources.minus(getUpgradeCosts().round())

  gameState.buildings[props.areaId] = {
    level: props.state.level,
    secondsRemaining: getUpgradeBuildingSeconds(),
    state: 'upgrading',
    type: props.buildingType,
  }
}

function destroy() {
  // TODO remove building model
  gameState.buildings[props.areaId] = undefined
}
</script>

<template>
  <BasePopupWrapper :title="`${props.buildingType.name} (level ${props.state.level})`">
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1 ml-4">
        <p class="font-semibold text-sm -ml-4">
          Produces per second
        </p>
        <Resources :resources="getCurrentIncome()" :round="false" />
      </div>

      <div v-if="canUpgrade() !== 'max-level'" class="flex flex-col gap-1 ml-4">
        <p class="font-semibold text-sm -ml-4">
          Costs to upgrade
        </p>
        <Resources :resources="getUpgradeCosts()" round />
        <p>Takes {{ getUpgradeBuildingSeconds().round(1).toNumber().toLocaleString() }} seconds</p>
      </div>

      <div v-if="canUpgrade() !== 'max-level'" class="flex flex-col gap-1 ml-4">
        <p class="font-semibold text-sm -ml-4">
          Upgraded produces per second
        </p>
        <Resources :resources="getUpgradedIncome()" :round="false" />
      </div>

      <p class="flex items-center justify-between">
        <button
          v-if="canUpgrade() === true"
          class="border p-1 rounded"
          @click="() => upgrade()"
        >
          upgrade
        </button>

        <span
          v-else-if="canUpgrade() === 'no-resources'"
          class="border p-1 rounded bg-gray-200 text-red-400 cursor-not-allowed"
        >
          not enough resources
        </span>

        <button
          class="border p-1 rounded"
          @click="() => destroy()"
        >
          destroy
        </button>
      </p>
    </div>
  </BasePopupWrapper>
</template>
