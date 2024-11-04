<script setup lang="ts">
import modelLoader from '@/assets/models/Ocean/Ocean.gltf'
import useDebugStore from '@/composables/useDebugStore'
import useThreeHelper from '@/composables/useThreeHelper'
import { useLoop, useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Mesh, PlaneGeometry, ShaderMaterial } from 'three'
import { watch } from 'vue'

const { scene } = useTresContext()
const { addShadow } = useThreeHelper()
const { scenes } = await modelLoader
const { render } = useLoop()
const { showWaterShader } = storeToRefs(useDebugStore())

const sceneGroup = scene.value.getObjectByName('sceneGroup') ?? scene.value
const oceanScene = scenes.Ocean

addShadow(oceanScene.Object.ocean)

const vertexShader = `
varying vec3 vNormal;
varying vec2 vUv;
uniform float time;

void main() {
  // Animated wave movement
  vec3 pos = position;
  pos.z += sin(pos.x * 4.0 + time) * 0.1;
  pos.z += sin(pos.y * 4.0 + time * 0.5) * 0.2;

  // Use the normal vertex normal for lighting
  vNormal = normal;

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = `
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  // Simple shading based on the normal direction
  float light = dot(vNormal, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;

  // Water color (simple blue here)
  vec3 waterColor = vec3(0.0, 0.5, 0.7);

  // Calculate opacity based on a base opacity (0.6) and depth variation
  float depthFactor = gl_FragCoord.z * 0.4; // 0.4 adjusts the intensity of the effect
  float opacity = 0.6 - depthFactor;

  // Set color and opacity
  gl_FragColor = vec4(waterColor * light, opacity);
}
`

const uniforms = {
  time: { value: 0.0 },
}

const waterMaterial = new ShaderMaterial({
  fragmentShader,
  transparent: true,
  uniforms,
  vertexShader,
  wireframe: false,
})

const geometry = new PlaneGeometry(200, 200, 100, 100)
const waterMesh = new Mesh(geometry, waterMaterial)
waterMesh.rotation.x = -Math.PI / 2 // rotate the water
waterMesh.receiveShadow = true // TODO fix bc this is not working
// sceneGroup.add(waterMesh)
// addShadowAndAddToGroup(sceneGroup, waterMesh)

render(({ camera, renderer, scene }) => {
  uniforms.time.value += 0.05
  renderer.render(scene, camera)
})

watch(showWaterShader, () => {
  sceneGroup.remove(oceanScene.Object.ocean)
  sceneGroup.remove(waterMesh)
  if (showWaterShader.value) {
    sceneGroup.add(waterMesh)
    return
  }
  sceneGroup.add(oceanScene.Object.ocean)
}, {
  immediate: true,
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
