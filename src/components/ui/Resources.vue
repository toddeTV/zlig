<script setup lang="ts">
import ResourceEntry from '@/components/ui/misc/resources/ResourceEntry.vue'
import type { PlainResources } from '@/game-logic/resources.js'

const props = defineProps<{
  resources: PlainResources
  available?: PlainResources
}>()
</script>

<template>
  <p>
    Gold: <ResourceEntry :available="props.available?.gold" :resource="props.resources.gold" />
  </p>
</template>

<style scoped>
</style>
