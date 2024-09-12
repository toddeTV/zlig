<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import useThreeHelper from '@/composables/useThreeHelper'
import { useTresContext } from '@tresjs/core'

const { scene } = useTresContext()
const { addShadowAndAddToGroup } = useThreeHelper()
const { scenes } = await modelLoader

const islandScene = scenes.Island

addShadowAndAddToGroup(scene.value, islandScene.Object.water)
addShadowAndAddToGroup(scene.value, islandScene.Object.island_lvl4_grass)
addShadowAndAddToGroup(scene.value, islandScene.Object.island_lvl2_beach)
addShadowAndAddToGroup(scene.value, islandScene.Object.island_lvl3_grass)
addShadowAndAddToGroup(scene.value, islandScene.Object.island_lvl5_grass)
addShadowAndAddToGroup(scene.value, islandScene.Object.island_lvl1_underBeach)
addShadowAndAddToGroup(scene.value, islandScene.Object.island_lvl0_seabed)
addShadowAndAddToGroup(scene.value, islandScene.Object.water)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea00)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea03)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea02)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea01)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea07)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea04)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea05)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea06)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea08)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea09)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea10)
// addShadowAndAddToGroup(scene.value, islandScene.Object.buildArea11)
addShadowAndAddToGroup(scene.value, islandScene.Object.waterfall_lvl1)
addShadowAndAddToGroup(scene.value, islandScene.Object.waterfall_lvl0)
addShadowAndAddToGroup(scene.value, islandScene.Object.waterfall_lvl1_to_lvl0)
addShadowAndAddToGroup(scene.value, islandScene.Object.mountain_lvl1)
addShadowAndAddToGroup(scene.value, islandScene.Object.mountain_lvl0)
addShadowAndAddToGroup(scene.value, islandScene.Object.mountain_lvl3)
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
