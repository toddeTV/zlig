<script setup lang="ts">
const props = defineProps<{
  min: number
  max: number
  value: number
}>()
</script>

<template>
  <progress
    class="rounded-full"
    :max="props.max"
    :min="props.min"
    :value="props.value"
  />
</template>
