import { type TresObject3D, trasverseObjects, useLogger } from '@tresjs/core'
import type { AnimationClip, Material, Scene } from 'three'
import { DRACOLoader, type GLTF, GLTFLoader } from 'three-stdlib'

const dracoLoader = new DRACOLoader()
  .setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/')
  .preload()

const gltfLoader = new GLTFLoader().setDRACOLoader(dracoLoader)

export interface GLTFLoaderOptions {
  /**
   * Whether to use Draco compression.
   *
   * @type {boolean}
   * @memberof GLTFLoaderOptions
   */
  draco?: boolean
  /**
   * The path to the Draco decoder.
   *
   * @type {string}
   * @memberof GLTFLoaderOptions
   */
  decoderPath?: string
}

export interface GLTFResult extends GLTF {
  animations: Array<AnimationClip>
  nodes: Record<string, TresObject3D>
  materials: Record<string, Material>
  scene: Scene & GLTF['scene']
}

export async function useGLTF(
  path: string,
): Promise<GLTFResult> {
  const { logError } = useLogger()

  return new Promise<GLTFResult>((resolve, reject) => {
    gltfLoader.load(path, (model) => {
      if (model.scene) {
        Object.assign(model, trasverseObjects(model.scene))
      }

      resolve(model as GLTFResult)
    }, undefined, event => reject(logError('[useGLTF] - Failed to load resource', event)))
  })
}
