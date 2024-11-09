<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingArea.js'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import DebugMenu from '../debug/DebugMenu.vue'
import SelectedBuildingInConstruction from './SelectedBuildingInConstruction.vue'
import SelectedBuildingUpgrading from './SelectedBuildingUpgrading.vue'
import SelectedEmptyBuildingArea from './SelectedEmptyBuildingArea.vue'

const { buildings } = storeToRefs(useGameState())
const selectedBuildingArea = useSelectedBuildingArea()
const selectedBuildingInstance = computed(() => selectedBuildingArea.id ? buildings.value[selectedBuildingArea.id] : undefined)

const hasDebug = ref(true)
</script>

<template>
  <div class="bg-white h-full flex flex-col gap-1">
    <div v-if="!selectedBuildingArea.id" class="flex-grow flex flex-col p-3 items-center justify-center">
      <p class="text-gray-400">
        Please select a building or building area...
      </p>
    </div>

    <div v-else class="flex-grow p-3">
      <SelectedBuildingInConstruction
        v-if="selectedBuildingInstance?.state === 'in-construction'"
        :building-area-id="selectedBuildingArea.id"
        :building-state="selectedBuildingInstance"
        :building-type="selectedBuildingInstance.type"
      />
      <SelectedBuildingUpgrading
        v-else-if="selectedBuildingInstance?.state === 'upgrading'"
        :building-area-id="selectedBuildingArea.id"
        :building-state="selectedBuildingInstance"
        :building-type="selectedBuildingInstance.type"
      />
      <SelectedEmptyBuildingArea v-else :building-area-id="selectedBuildingArea.id" />
    </div>

    <hr>

    <DebugMenu v-if="hasDebug" />

    <div class="text-gray-600 text-sm p-2 flex justify-between">
      <span>&copy; {{ new Date().getFullYear() }} The zlig authors</span>

      <span># TODO: version</span>
    </div>
  </div>
</template>
