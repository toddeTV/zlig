<script setup lang="ts">
import useDebugStore from '@/composables/useDebugStore'
import useGetParam from '@/composables/useGetParam'
import { storeToRefs } from 'pinia'

const { showVisualHelper } = storeToRefs(useDebugStore())
const { isParamPresent } = useGetParam()
</script>

<template>
  <TresAxesHelper v-if="showVisualHelper || isParamPresent('world') || isParamPresent('camera')" />
  <TresGridHelper v-if="showVisualHelper || isParamPresent('world') || isParamPresent('camera')" />
</template>

<style scoped>
</style>
