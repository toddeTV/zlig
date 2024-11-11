<script setup lang="ts">
const props = defineProps<{
  min: number | string
  max: number | string
  value: number | string
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
