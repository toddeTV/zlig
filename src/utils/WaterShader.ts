import { ShaderMaterial } from 'three'

export const vertexShader = `
varying vec3 vNormal;
varying vec2 vUv;
uniform float time;

void main() {
  // original position
  vec3 pos = position;

  // Animated wave movement
  pos.y += sin(pos.x * 100.0 + time) * 0.05;
  pos.y += sin(pos.z * 100.0 + time * 0.5) * 0.07;

  // Use the normal vertex normal for lighting
  vNormal = normal;

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

export const fragmentShader = `
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  // Simple shading based on the normal direction
  float light = dot(vNormal, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;

  // Water color (simple blue here)
  vec3 waterColor = vec3(0.0, 0.5, 0.7);

  // Calculate opacity based on a base opacity (0.6) and depth variation
  float depthFactor = gl_FragCoord.z * 0.4; // adjusts the intensity of the effect
  float opacity = 0.8 - depthFactor;

  // Set color and opacity
  gl_FragColor = vec4(waterColor * light, opacity);
}
`

export function getWaterMaterial() {
  const waterMaterial = new ShaderMaterial({
    fragmentShader,
    transparent: true,
    uniforms: { // init, must be set in the render loop
      time: { value: 0.0 },
    },
    vertexShader,
    wireframe: false,
  })
  return waterMaterial
}
