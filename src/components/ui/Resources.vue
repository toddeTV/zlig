<script setup lang="ts">
import type { PlainResources } from '@/game-logic/resources.js'
import ResourceEntry from './misc/resources/ResourceEntry.vue'

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
