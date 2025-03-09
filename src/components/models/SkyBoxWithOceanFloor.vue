<script setup lang="ts">
import { useCalculatedLightsStore } from '@/composables/useCalculatedLightsStore.js'
import { addToGroup } from '@/utils/threeHelper.js'
import { storeToRefs } from 'pinia'
import { BackSide, BoxGeometry, Color, type ColorRepresentation, Mesh, ShaderMaterial, Vector3 } from 'three'
import { shallowRef, watch } from 'vue'

const { lightColors } = storeToRefs(useCalculatedLightsStore())
const groupWrapperRef = shallowRef()

const seabedFragmentShaderCode = `
varying vec3 vWorldPosition;

uniform float fogDistanceNear;
uniform float fogDistanceFar;
uniform vec3 fogCenter;
uniform vec3 seabedColor;
uniform vec3 skyColor;

void main()    {
  // Direction from camera through pixel into scene
  vec3 direction = normalize(vWorldPosition - cameraPosition);
  vec3 up = vec3(0, -1, 0);

  // Calculate the intersection between the look-direction and the ocean surface plane
  float denom = dot(up, direction);
  float t = abs(denom) > 0.0001f ? dot(up, fogCenter - cameraPosition) / denom : 10000.0;
  vec3 intersection = cameraPosition + t * direction;
  // Horizontal distance (cylinder) of intersection to fog center
  float distance = length(intersection.xz);

  // Blend between seabed and sky/fog based on whether the seabed should still be visible under the water
  // 'skyFactor=1' is sky, 'skyFactor=0' is seabed, between is a blend of the ocean water / sea bed to fog
  float skyFactor = (dot(up, direction) <= 0.0) ? 1.0 : smoothstep(fogDistanceNear, fogDistanceFar, distance);
  vec3 color = mix(seabedColor, skyColor, skyFactor);
  gl_FragColor = vec4( color, 1.0 );
}`

const seabedVertexShaderCode = `
varying vec3 vWorldPosition;

void main()    {
  #include <begin_vertex>
  #include <project_vertex>
  vWorldPosition = (modelMatrix * vec4( position, 1.0 )).xyz;
  // Set z to camera.far to make the box be unaffected by the render distance (its always just within the render distance)
  gl_Position.z = gl_Position.w;
}`

function getSeabedMaterial(
  {
    fogCenter = new Vector3(0, 0, 0),
    fogDistanceFar = 150.0,
    fogDistanceNear = 110.0,
    seabedColor = new Color(0x191919),
    skyColor = new Color(0xE0F3FF),
  }:
  {
    fogCenter?: Vector3
    fogDistanceNear?: number
    fogDistanceFar?: number
    seabedColor?: ColorRepresentation
    skyColor?: ColorRepresentation
  },
) {
  const seabedUniforms = {
    fogCenter: { value: fogCenter },
    fogDistanceFar: { value: fogDistanceFar },
    fogDistanceNear: { value: fogDistanceNear },
    seabedColor: { value: seabedColor },
    skyColor: { value: skyColor },
  }

  const seabedMaterial = new ShaderMaterial({
    depthWrite: false,
    fog: false,
    fragmentShader: seabedFragmentShaderCode,
    side: BackSide,
    uniforms: seabedUniforms,
    vertexShader: seabedVertexShaderCode,
  })
  seabedMaterial.onBeforeCompile = (shader) => {
    seabedUniforms.fogCenter = shader.uniforms.fogCenter
    seabedUniforms.fogDistanceNear = shader.uniforms.fogDistanceNear
    seabedUniforms.fogDistanceFar = shader.uniforms.fogDistanceFar
    seabedUniforms.seabedColor = shader.uniforms.seabedColor
    seabedUniforms.skyColor = shader.uniforms.skyColor
  }
  return Object.assign(seabedMaterial, { uniforms: seabedUniforms })
}

const geometry = new BoxGeometry(50000, 50000, 50000)
const material = getSeabedMaterial({
  fogDistanceFar: 150.0,
  fogDistanceNear: 110.0,
  seabedColor: new Color(0x191919),
  skyColor: lightColors.value.sky,
})
const seabed = new Mesh(geometry, material)

watch(() => lightColors.value.sky, (newValue) => {
  material.uniforms.skyColor.value = newValue
})

const { stop } = watch(groupWrapperRef, (newValue) => {
  if (!newValue) {
    return
  }
  addToGroup(newValue, seabed, true)
  stop()
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
