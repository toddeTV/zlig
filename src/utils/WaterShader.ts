import { MeshStandardMaterial } from 'three'
import type { ColorRepresentation } from 'three'

/**
 * Wave displacement code (getWave and wavedx functions) by afl_ext provided under MIT License (https://www.shadertoy.com/view/MdXyzX)
 * hash22 function: Copyright (c)2014 David Hoskins; provided under MIT License (https://www.shadertoy.com/view/4djSRW)
 * waveTangetialAmplitude: the amount of movement sideways for each point (to break up the repeating wave patterns)
 * relativeHeightOffset: waves get offset by relativeHeightOffset * waveAmplitude. The default value of -0.75 puts the peaks of the highest waves roughly at the geometry surface
 */
export function getWaterMaterial(
  {
    relativeHeightOffset = -0.75,
    waterColor = 0x0384C4,
    waveAmplitude = 1.8,
    waveSpeed = 1.0,
    waveTangentialAmplitude = 1.0,
  }:
  {
    waterColor?: ColorRepresentation
    waveSpeed?: number
    waveAmplitude?: number
    waveTangentialAmplitude?: number
    relativeHeightOffset?: number
  },
) {
  const waterMaterial = new MeshStandardMaterial({
    color: waterColor,
    flatShading: true,
    metalness: 0.0,
    opacity: 0.8,
    roughness: 0.0,
    shadowSide: 1, // set to Backside; this is a dumb hack to fix the mysterious shadow casting even if shadow casting is disabled
    transparent: true,
  })

  waterMaterial.onBeforeCompile = function (shader) {
    shader.uniforms.time = { value: 0.0 }
    shader.uniforms.waveAmplitude = { value: waveAmplitude }
    shader.uniforms.waveTangentialAmplitude = { value: waveTangentialAmplitude }
    shader.uniforms.waveSpeed = { value: waveSpeed }
    shader.uniforms.relativeHeightOffset = { value: relativeHeightOffset }
    shader.vertexShader = shader.vertexShader.replace(
      `#define STANDARD`,
      `#define STANDARD
       uniform float time;
       uniform float waveSpeed;
       uniform float waveAmplitude;
       uniform float waveTangentialAmplitude;
       uniform float relativeHeightOffset;`,
    )
    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `vec2 hash22(vec2 p)
      {
	      vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
        p3 += dot(p3, p3.yzx+33.33);
        return fract((p3.xx+p3.yz)*p3.zy);
      }
      
      vec2 wavedx(vec2 position, vec2 direction, float frequency, float timeshift) {
        float x = dot(direction, position) * frequency + timeshift;
        float wave = exp(sin(x) - 1.0);
        float dx = wave * cos(x);
        return vec2(wave, -dx);
      }
      
      float getWaves(vec2 position, int iterations, float speed) {
        float wavePhaseShift = length(position) * 0.1; // this is to avoid every octave having exactly the same phase everywhere
        float iter = 0.0; // this will help generating well distributed wave directions
        float frequency = 1.0; // frequency of the wave, this will change every iteration
        float timeMultiplier = 2.0; // time multiplier for the wave, this will change every iteration
        float weight = 1.0;// weight in final sum for the wave, this will change every iteration
        float sumOfValues = 0.0; // will store final sum of values
        float sumOfWeights = 0.0; // will store final sum of weights
        for(int i=0; i < iterations; i++) {
          // generate some wave direction that looks kind of random
          vec2 p = vec2(sin(iter), cos(iter));
      
          // calculate wave data
          vec2 res = wavedx(position, p, frequency, time * speed * timeMultiplier + wavePhaseShift);
  
          // shift position around according to wave drag and derivative of the wave
          position += p * res.y * weight * 0.38;
  
          // add the results to sums
          sumOfValues += res.x * weight;
          sumOfWeights += weight;
  
          // modify next octave
          weight = mix(weight, 0.0, 0.2);
          frequency *= 1.18;
          timeMultiplier *= 1.07;
  
          // add some kind of random value to make next wave look random too
          iter += 1232.399963;
        }
        // calculate and return
        return sumOfValues / sumOfWeights;
      }
  
      void main() {`,
    )
    shader.vertexShader = shader.vertexShader.replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>
          transformed.x += getWaves(transformed.xz, 2, waveSpeed * 0.3667233576) * waveTangentialAmplitude;
          transformed.z += getWaves(transformed.xz + vec2(4.0), 2, waveSpeed * 0.72357832) * waveTangentialAmplitude;
          transformed.y += getWaves(transformed.xz, 12, waveSpeed) * waveAmplitude + relativeHeightOffset * waveAmplitude;
          #ifdef USE_ALPHAHASH
            vPosition = transformed;
          #endif`,
    )
    this.userData.shader = shader
  }
  return waterMaterial
}

export function getWaterfallMaterial() {
  const waterfallMaterial = new MeshStandardMaterial({
    color: 0x0384C4,
    opacity: 0.9,
    transparent: true,
  })
  waterfallMaterial.onBeforeCompile = function (shader) {
    shader.uniforms.time = { value: 0.0 }
    shader.fragmentShader = shader.fragmentShader.replace(
      `#define STANDARD`,
      `#define STANDARD\nuniform float time;`,
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      `void main() {`,
      `float wave(vec2 position) {
        return 0.0;
      }
  
      void main() {`,
    )
    this.userData.shader = shader
  }
  return waterfallMaterial
}
