<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="bg-white rounded w-max max-w-[500px]">
    <div class="pt-3 px-3 pb-1 border-b font-bold text-lg">
      {{ props.title }}
    </div>

    <div class="pb-3 px-3 pt-1 border-t">
      <slot />
    </div>
  </div>
</template>
