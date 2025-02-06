<script setup lang="ts">
import { useDebugStore } from '@/composables/useDebugStore.js'
import { storeToRefs } from 'pinia'

const { showVisualHelper } = storeToRefs(useDebugStore())
</script>

<template>
  <TresAxesHelper
    v-if="showVisualHelper"
    :args="[25]"
    :position-y=".1"
  />
  <TresGridHelper
    v-if="showVisualHelper"
    :args="[100, 100]"
  />
</template>

<style scoped>
</style>
