<script setup lang="ts">
import Resources from '@/components/ui/Resources.vue'
import useGameState from '@/composables/useGameState.js'
import { ResourceRecord, ResourcesPerMillisecond } from '@/game-logic/resources.js'
import Big from 'big.js'
import { DEV } from 'esm-env'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { BuildingAreaId, BuildingStateProducing, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingType: BuildingType
  buildingState: BuildingStateProducing
}>()

const gameState = useGameState()
const { resources } = storeToRefs(gameState)

// TODO: Put this into the game state.
// TODO: Make this individual per building type.
const upgradeModifiers = {
  costs: new ResourceRecord({ gold: new Big('1') }),
  duration: 1,
}
const incomeModifier = new ResourceRecord({ gold: new Big('1') })

const currentIncome = computed(() => {
  const base = props.buildingType.levelProgression.getBaseIncomeForLevel(props.buildingState.level)

  return new ResourcesPerMillisecond(base.times(incomeModifier))
})

const upgradeCosts = computed(() => {
  const base = props.buildingType.levelProgression.getBaseCostsForLevel(props.buildingState.level + 1)

  return base.times(upgradeModifiers.costs).round()
})

const upgradeBuildingDuration = computed(() => {
  const base = props.buildingType.levelProgression.getBaseBuildingDurationForLevel(props.buildingState.level + 1)

  return base.times(upgradeModifiers.duration)
})

const upgradedIncome = computed(() => {
  const base = props.buildingType.levelProgression.getBaseIncomeForLevel(props.buildingState.level + 1)

  return new ResourcesPerMillisecond(base.times(incomeModifier))
})

const canUpgrade = computed(() => {
  if (props.buildingType.levelProgression.maxLevel && props.buildingState.level >= props.buildingType.levelProgression.maxLevel) {
    return 'max-level'
  }

  if (!resources.value.gte(upgradeCosts.value)) {
    return 'no-resources'
  }

  return true
})

function upgradeBuilding() {
  gameState.$patch((state) => {
    state.buildings[props.buildingAreaId] = {
      durationRemaining: upgradeBuildingDuration.value,
      initialDuration: upgradeBuildingDuration.value,
      level: props.buildingState.level,
      state: 'upgrading',
      type: props.buildingType,
    }

    state.resources = state.resources.minus(upgradeCosts.value)
  })
}

function destroyBuilding() {
  // TODO: Determine the refunds.

  gameState.$patch((state) => {
    state.buildings[props.buildingAreaId] = undefined
  })
}
</script>

<template>
  <h3 class="font-semibold mb-4">
    <span class="text-xl">{{ props.buildingType.name }}</span>
    <span> (Level {{ props.buildingState.level }})</span>
  </h3>

  <!-- TODO: Add building type descriptions and display them here. -->

  <div class="mb-4">
    <p class="font-semibold">
      This building produces per hour:
    </p>
    <div class="flex gap-2 ml-4">
      <Resources :resources="currentIncome.perHour()" />
    </div>
  </div>

  <div v-if="DEV" class="mb-4 border-4 border-red-600 text-red-950 bg-red-100 p-2 border-dashed">
    <p class="font-semibold">
      Internal resource buffer:
    </p>
    <div class="flex gap-2 ml-4">
      <Resources :resources="props.buildingState.internalBuffer" />
    </div>
  </div>

  <div class="mb-4 flex flex-col">
    <button
      class="flex flex-col gap-2 border rounded p-2 bg-black bg-opacity-10 text-left"
      :class="{
        'hover:bg-opacity-30': canUpgrade === true,
        'cursor-pointer': canUpgrade === true,
        'cursor-not-allowed': canUpgrade !== true,
      }"
      :disabled="canUpgrade !== true"
      @click="upgradeBuilding"
    >
      <template v-if="canUpgrade !== 'max-level'">
        <p>Upgrade to level <b>{{ props.buildingState.level + 1 }}</b></p>

        <div>
          <p class="font-semibold">
            Costs to upgrade:
          </p>
          <div class="flex gap-2 ml-4">
            <Resources :available="resources" :resources="upgradeCosts" />
          </div>
        </div>

        <p class="font-semibold">
          Duration to upgrade: <b>{{ upgradeBuildingDuration.format() }}</b>
        </p>

        <div>
          <p class="font-semibold">
            Produces per hour after upgrade:
          </p>
          <div class="flex gap-2 ml-4">
            <Resources :resources="upgradedIncome.perHour()" />
          </div>
        </div>
      </template>

      <div v-if="typeof props.buildingType.levelProgression.maxLevel === 'number'">
        <p class="italic" :class="{ 'text-red-500': canUpgrade === 'max-level' }">
          <span v-if="canUpgrade === 'max-level'">This building reached the max level of <b>{{ props.buildingType.levelProgression.maxLevel }}</b></span>
          <span v-else>This building can be upgraded until level <b>{{ props.buildingType.levelProgression.maxLevel }}</b></span>
        </p>
      </div>
    </button>
  </div>

  <div>
    <button class="border p-1 rounded" @click="destroyBuilding">
      destroy building
    </button>
  </div>
</template>

<style scoped>
</style>
