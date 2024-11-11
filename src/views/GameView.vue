<script setup lang="ts">
import SideBar from '@/components/ui/layout/game/sidebar/SideBar.vue'
import TopBar from '@/components/ui/layout/game/topbar/TopBar.vue'
import WorldWindow from '@/components/ui/layout/game/WorldWindow.vue'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingArea.js'
import { ref } from 'vue'

const sidebarOpen = ref(false)
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

const selectedBuildingArea = useSelectedBuildingArea()
selectedBuildingArea.$subscribe((_, newId) => {
  if (newId) {
    // The user selected a building area.
    sidebarOpen.value = true
  }
})
</script>

<template>
  <div class="flex flex-col flex-grow">
    <TopBar />

    <div class="relative flex flex-grow">
      <span
        class="
          md:hidden
          absolute left-0 top-[7.5%] transition-[left]
          shadow rounded-r-full pl-1 py-2 pr-3 flex items-center text-xl z-20 bg-white/75
        "
        :class="{ 'left-[90%]': sidebarOpen }"
        title="Toggle menu"
        @click="toggleSidebar"
      >
        <span :class="{ 'icon-[ph--list]': !sidebarOpen, 'icon-[ph--x]': sidebarOpen }" />
      </span>

      <div
        class="
          absolute md:relative md:left-0 right-0 top-0 bottom-0
          -left-[100%] transition-[left]
          max-w-[90%] md:max-w-none md:w-[25%] lg:w-[22.5%] xl:w-[20%]
          overflow-hidden z-30 shadow
        "
        :class="{ 'left-0': sidebarOpen }"
      >
        <SideBar />
      </div>

      <span
        class="
          absolute left-0 right-0 top-0 bottom-0 md:hidden
          opacity-0 pointer-events-none
          transition-opacity bg-black z-10
        "
        :class="{ 'opacity-50': sidebarOpen, 'pointer-events-auto': sidebarOpen }"
        @click="toggleSidebar"
      />

      <div class=" flex-grow">
        <WorldWindow />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
