<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import { addShadowAndAddToGroup } from '@/utils/threeHelper'
import { useTresContext } from '@tresjs/core'

const { scene } = useTresContext()
const { scenes } = await modelLoader

addShadowAndAddToGroup(scene.value, scenes.Island.Scene)

// const sceneGroup = scene.value.getObjectByName('sceneGroup') ?? scene.value
// const islandScene = scenes.Island
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl4_grass)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl2_beach)
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
