<script setup lang="ts">
import GameCanvas from '@/components/ui/layout/game/GameCanvas.vue'
import SideBar from '@/components/ui/layout/game/sidebar/SideBar.vue'
import TopBar from '@/components/ui/layout/game/topbar/TopBar.vue'
import useGetParam from '@/composables/useGetParam'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingArea.js'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { init, isParamPresent } = useGetParam()

init(route.query)

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
    <TopBar v-if="!isParamPresent('world')" />

    <div class="relative flex flex-grow">
      <span
        v-if="!isParamPresent('world')"
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
        v-if="!isParamPresent('world')"
        class="
          max-h-screen
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
        v-if="!isParamPresent('world')"
        class="
          absolute left-0 right-0 top-0 bottom-0 md:hidden
          opacity-0 pointer-events-none
          transition-opacity bg-black z-10
        "
        :class="{ 'opacity-50': sidebarOpen, 'pointer-events-auto': sidebarOpen }"
        @click="toggleSidebar"
      />

      <div class=" flex-grow">
        <GameCanvas />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
