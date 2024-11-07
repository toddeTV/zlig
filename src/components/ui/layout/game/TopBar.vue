<script setup lang="ts">
const { sidebarToggleId } = defineProps({
  sidebarToggleId: {
    required: true,
    type: String,
  },
})
</script>

<template>
  <div class="bg-green-100 shadow z-20 flex items-center gap-3 p-3">
    <label class="md:hidden flex items-center text-xl" :for="sidebarToggleId">
      <span class="icon-[ph--list]" />
    </label>

    <code>topbar</code>
  </div>
</template>
