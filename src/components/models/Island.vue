<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'
import useThreeHelper from '@/composables/useThreeHelper'
import { useTresContext } from '@tresjs/core'

const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

const { scene } = useTresContext()
const { addShadowAndAddToGroup } = useThreeHelper()
const { scenes } = await modelLoader

const islandScene = scenes.Island.Scene

addShadowAndAddToGroup(scene.value, islandScene)

// find all build areas & register them
// const buildAreas = islandScene.getObjectsByProperty('is_building_place', true)
const buildAreas = islandScene.children.filter(child => child.name.startsWith('buildArea'))
buildAreas.forEach((buildArea) => {
  registeredForSelectingModelStore.register(buildArea)
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
