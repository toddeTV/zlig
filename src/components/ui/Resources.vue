<script setup lang="ts">
import { computed } from 'vue'
import { type PlainResources, ResourceRecord } from '@/game-logic/resources.js'

const props = defineProps<{
  resources: ResourceRecord
  round: boolean
} | {
  resources: PlainResources
  round?: boolean
}>()

const final = computed(() => {
  if (props.resources instanceof ResourceRecord) {
    return props.round ? props.resources.round().asPlain() : props.resources.asPlain()
  }

  return props.resources
})
</script>

<template>
  <p>
    {{ final.gold.toNumber().toLocaleString() }} gold
  </p>
</template>
