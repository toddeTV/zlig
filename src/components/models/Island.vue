<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import useDebugStore from '@/composables/useDebugStore'
import useThreeHelper from '@/composables/useThreeHelper'
import { useLoop, useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Mesh, PlaneGeometry, ShaderMaterial } from 'three'
import { watch } from 'vue'

const { scene } = useTresContext()
const { addShadow, addShadowAndAddToGroup } = useThreeHelper()
const { scenes } = await modelLoader
const { render } = useLoop()
const { showWaterShader } = storeToRefs(useDebugStore())

const sceneGroup = scene.value.getObjectByName('sceneGroup') ?? scene.value
const islandScene = scenes.Island

// addShadowAndAddToGroup(sceneGroup, islandScene.Object.water)
addShadow(islandScene.Object.water)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl4_grass)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl2_beach)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl3_grass)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl5_grass)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl1_underBeach)
addShadowAndAddToGroup(sceneGroup, islandScene.Object.island_lvl0_seabed)
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

const vertexShader = `
varying vec3 vNormal;
varying vec2 vUv;
uniform float time;

void main() {
  // Animierte Wellenbewegung
  vec3 pos = position;
  pos.z += sin(pos.x * 4.0 + time) * 0.1;
  pos.z += sin(pos.y * 4.0 + time * 0.5) * 0.2;

  // Verwende die normale Vertex-Normale für das Lighting
  vNormal = normal;

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = `
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  // Einfaches Shading basierend auf der Normalenrichtung
  float light = dot(vNormal, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;

  // Farbe des Wassers (hier ein einfaches Blau)
  vec3 waterColor = vec3(0.0, 0.5, 0.7);
  gl_FragColor = vec4(waterColor * light, 1.0);
}
`

const uniforms = {
  time: { value: 0.0 },
}

const waterMaterial = new ShaderMaterial({
  fragmentShader,
  uniforms,
  vertexShader,
  wireframe: false,
})

const geometry = new PlaneGeometry(200, 200, 100, 100)
const waterMesh = new Mesh(geometry, waterMaterial)
waterMesh.rotation.x = -Math.PI / 2 // rotate the water
waterMesh.receiveShadow = true
// sceneGroup.add(waterMesh)
// addShadowAndAddToGroup(sceneGroup, waterMesh)

render(({ camera, renderer, scene }) => {
  uniforms.time.value += 0.05
  renderer.render(scene, camera)
})

watch(showWaterShader, () => {
  sceneGroup.remove(islandScene.Object.water)
  sceneGroup.remove(waterMesh)
  if (showWaterShader.value) {
    sceneGroup.add(waterMesh)
  }
  else {
    sceneGroup.add(islandScene.Object.water)
  }
}, {
  immediate: true,
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
