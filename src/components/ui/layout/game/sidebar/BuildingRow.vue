<script setup lang="ts">
import Resources from '@/components/ui/Resources.vue'
import { useGameStateStore } from '@/composables/useGameStateStore.js'
import { ResourceRecord, ResourcesPerMillisecond } from '@/game-logic/resources.js'
import Big from 'big.js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { BuildingAreaId, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  buildingType: BuildingType
  buildingAreaId: BuildingAreaId
}>()

const { buildings, resources } = storeToRefs(useGameStateStore())

// TODO: Put this into the game state.
// TODO: Make this individual per building type.
const buildModifiers = {
  costs: new ResourceRecord({ gold: new Big('1') }),
  duration: 1,
}
const incomeModifier = new ResourceRecord({ gold: new Big('1') })

const costs = computed(() => {
  const base = props.buildingType.levelProgression.getBaseCostsForLevel(1)

  return base.times(buildModifiers.costs).round()
})

const buildingDuration = computed(() => {
  const base = props.buildingType.levelProgression.getBaseBuildingDurationForLevel(1)

  return base.times(buildModifiers.duration)
})

const income = computed(() => {
  const base = props.buildingType.levelProgression.getBaseIncomeForLevel(1)

  return new ResourcesPerMillisecond(base.times(incomeModifier))
})

const existingInstancesCount = computed(() => Object.values(buildings.value).filter(building => building?.type.id === props.buildingType.id).length)

const canBuild = computed(() => {
  if (typeof props.buildingType.maxInstances === 'number' && existingInstancesCount.value >= props.buildingType.maxInstances) {
    return 'max-instances'
  }

  if (!resources.value.gte(costs.value)) {
    return 'no-resources'
  }

  return true
})

function build() {
  buildings.value[props.buildingAreaId] = {
    durationRemaining: buildingDuration.value,
    initialDuration: buildingDuration.value,
    level: 0,
    state: 'in-construction',
    type: props.buildingType,
  }

  resources.value = resources.value.minus(costs.value)
}
</script>

<template>
  <button
    class="flex flex-col gap-2 border rounded p-2 bg-black bg-opacity-10 text-left"
    :class="{
      'hover:bg-opacity-30': canBuild === true,
      'cursor-pointer': canBuild === true,
      'cursor-not-allowed': canBuild !== true,
    }"
    :disabled="canBuild !== true"
    @click="build"
  >
    <p class="font-bold text-lg">
      {{ props.buildingType.name }}
    </p>

    <p class="ml-4 mb-2">
      {{ props.buildingType.description }}
    </p>

    <div>
      <p class="font-semibold">
        Costs to build:
      </p>
      <div class="flex gap-2 ml-4">
        <Resources :available="resources" :resources="costs" />
      </div>
    </div>

    <p class="font-semibold">
      Duration to build: <b>{{ buildingDuration.format() }}</b>
    </p>

    <div>
      <p class="font-semibold">
        Produces per hour:
      </p>
      <div class="flex gap-2 ml-4">
        <Resources :resources="income.perHour()" />
      </div>
    </div>

    <div v-if="typeof props.buildingType.maxInstances === 'number'">
      <p class="italic" :class="{ 'text-red-500': canBuild === 'max-instances' }">
        You can build
        <b v-if="canBuild !== 'max-instances'">{{ props.buildingType.maxInstances - existingInstancesCount }}</b>
        <b v-else>no</b>
        more (max. <b>{{ props.buildingType.maxInstances }}</b>)
      </p>
    </div>
  </button>
</template>

<style scoped>
</style>
