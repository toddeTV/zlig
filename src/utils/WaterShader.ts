import { overrideFogShader } from '@/utils/threeHelper.js'
import { MeshStandardMaterial, UniformsUtils, Vector3 } from 'three'
import type { ColorRepresentation, WebGLProgramParametersWithUniforms } from 'three'

/**
 * Wave displacement code (getWave and wavedx functions) by afl_ext provided under MIT License (https://www.shadertoy.com/view/MdXyzX)
 * hash22 function: Copyright (c)2014 David Hoskins; provided under MIT License (https://www.shadertoy.com/view/4djSRW)
 * waveTangetialAmplitude: the amount of movement sideways for each point (to break up the repeating wave patterns)
 * relativeHeightOffset: waves get offset by relativeHeightOffset * waveAmplitude. The default value of -0.75 puts the peaks of the highest waves roughly at the geometry surface
 *
 * @param fogActive - whether to be affected by the fog
 * @param fogCenter - the center of the fog
 * @param fogDistanceOffset - the distance offset of the fog
 * @param waterColor - the color of the water
 * @param waveSpeed - the speed of the waves
 * @param waveAmplitude - the amplitude of the waves (wave height)
 * @param waveTangentialAmplitude - the amplitude of the tangential waves (side movement amount)
 * @param relativeHeightOffset - the offset of the waves (moves the wave plane up and down)
 * @param waterSwingDirection - the axis to rotate the waves around
 * @returns {MeshStandardMaterial} - the water material
 */
export function getWaterMaterial(
  {
    fogActive = false,
    fogCenter = new Vector3(0, 0, 0),
    fogDistanceOffset = 0,
    relativeHeightOffset = -0.75,
    waterColor = 0x0384C4,
    waterSwingDirection = 'xy',
    waveAmplitude = 1.8,
    waveSpeed = 1.0,
    waveTangentialAmplitude = 1.0,
  }:
  {
    fogActive?: boolean
    fogCenter?: Vector3
    fogDistanceOffset?: number
    waterColor?: ColorRepresentation
    waveSpeed?: number
    waveAmplitude?: number
    waveTangentialAmplitude?: number
    relativeHeightOffset?: number
    waterSwingDirection: 'xz' | 'xy'
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

  const timeUniform = { time: { value: 0 } }

  waterMaterial.onBeforeCompile = function (shader: WebGLProgramParametersWithUniforms) {
    if (fogActive) {
      overrideFogShader(shader, fogCenter, fogDistanceOffset)
    }

    shader.uniforms = UniformsUtils.merge([
      shader.uniforms,
      timeUniform,
      {
        relativeHeightOffset: { value: relativeHeightOffset },
        waveAmplitude: { value: waveAmplitude },
        waveSpeed: { value: waveSpeed },
        waveTangentialAmplitude: { value: waveTangentialAmplitude },
      },
    ])

    // We need to reassign this because `UniformsUtils.merge` clones each uniform and in this process the connection to
    // the original object is lost...
    timeUniform.time = shader.uniforms.time

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
          transformed.x += getWaves(transformed.${waterSwingDirection}, 2, waveSpeed * 0.3667233576) * waveTangentialAmplitude;
          transformed.z += getWaves(transformed.${waterSwingDirection} + vec2(4.0), 2, waveSpeed * 0.72357832) * waveTangentialAmplitude;
          transformed.y += getWaves(transformed.${waterSwingDirection}, 12, waveSpeed) * waveAmplitude + relativeHeightOffset * waveAmplitude;
          #ifdef USE_ALPHAHASH
            vPosition = transformed;
          #endif`,
    )
  }

  return Object.assign(waterMaterial, { uniforms: timeUniform })
}
