<script setup lang="ts">
import ResourceEntry from '@/components/ui/misc/resources/ResourceEntry.vue'
import type { PlainResources } from '@/game-logic/resources.js'

const props = defineProps<{
  resources: PlainResources
  available?: PlainResources
}>()
</script>

<template>
  <div class="flex gap-3 items-baseline text-2xl grow justify-center">
    <span class="icon-[ph--hand-coins-thin] mt-1 mr-1 text-xl" />
    <ResourceEntry :available="props.available?.gold" :resource="props.resources.gold" />
  </div>
</template>

<style scoped>
</style>
