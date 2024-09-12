<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import useThreeHelper from '@/composables/useThreeHelper'
import { useTresContext } from '@tresjs/core'

const { scene } = useTresContext()
const { addShadowAndAddToGroup } = useThreeHelper()
const { scenes } = await modelLoader

const sceneGroup = scene.value.getObjectByName('sceneGroup') ?? scene.value
const islandScene = scenes.Island

addShadowAndAddToGroup(sceneGroup, islandScene.Object.water)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl4_grass)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl2_beach)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl3_grass)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl5_grass)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl1_underBeach)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl0_seabed)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.water)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea00)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea03)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea02)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea01)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea07)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea04)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea05)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea06)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea08)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea09)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea10)
// addShadowAndAddToGroup(sceneGroup, islandScene.Object.buildArea11)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.waterfall_lvl1)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.waterfall_lvl0)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.waterfall_lvl1_to_lvl0)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.mountain_lvl1)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.mountain_lvl0)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.mountain_lvl3)
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
