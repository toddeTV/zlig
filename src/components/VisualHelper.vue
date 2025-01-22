<script setup lang="ts">
import { useDebugStore } from '@/composables/useDebugStore.js'
import { storeToRefs } from 'pinia'

const { showVisualHelper } = storeToRefs(useDebugStore())
</script>

<template>
  <TresAxesHelper v-if="showVisualHelper" />
  <TresGridHelper v-if="showVisualHelper" />
</template>

<style scoped>
</style>
