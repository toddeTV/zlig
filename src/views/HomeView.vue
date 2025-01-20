<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const { replace } = useRouter()

onBeforeMount(() => {
  replace('/game')
})
</script>

<template>
  <main class="flex flex-row w-full h-screen overflow-hidden justify-center items-center text-xl">
    Loading...
  </main>
</template>

<style scoped>
</style>
