<script setup lang="ts">
const { sidebarToggleId } = defineProps({
  sidebarToggleId: {
    required: true,
    type: String,
  },
})
</script>

<template>
  <div class="bg-blue-100 h-full p-3">
    <label class="md:hidden flex items-center justify-end text-xl" :for="sidebarToggleId" title="Close menu">
      <span class="icon-[ph--x]" />
    </label>

    <code>sidebar</code>
  </div>
</template>
