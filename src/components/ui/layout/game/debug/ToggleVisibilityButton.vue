<script setup lang="ts">
const model = defineModel<boolean>()
</script>

<template>
  <label
    class="border select-none cursor-pointer border-red-600 bg-red-300 p-2 items-center rounded-sm flex flex-col gap-2"
    :class="{ 'opacity-50': !model }"
  >
    <input
      v-model="model"
      label
      type="checkbox"
    >

    <span class="uppercase"><slot /></span>
  </label>
</template>

<style scoped>
</style>
