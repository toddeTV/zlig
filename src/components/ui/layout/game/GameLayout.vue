<script setup lang="ts">
import SideBar from './SideBar.vue'
import TopBar from './TopBar.vue'

const sidebarToggleId = 'sidebar-toggle'
</script>

<template>
  <div class="flex flex-col flex-grow">
    <TopBar :sidebar-toggle-id />

    <div class="relative flex flex-grow">
      <input :id="sidebarToggleId" class="hidden peer" type="checkbox">

      <div
        class="
          absolute md:relative md:left-0 right-0 top-0 bottom-0
          -left-[100%] peer-checked:left-0
          transition-[left]
          max-w-[90%] md:max-w-none md:w-[25%] lg:w-[22.5%] xl:w-[20%]
          overflow-hidden z-10 shadow
        "
      >
        <SideBar :sidebar-toggle-id />
      </div>

      <div class=" bg-purple-100/30 flex-grow">
        <code>gamepanel</code>
      </div>
    </div>
  </div>
</template>
