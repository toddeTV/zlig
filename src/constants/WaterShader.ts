export const vertexShader = `
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
