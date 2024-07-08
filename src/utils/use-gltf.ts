import { type TresObject3D, useLoader } from '@tresjs/core'
import type { AnimationClip, Material, Scene } from 'three'
import { DRACOLoader, GLTFLoader } from 'three-stdlib'

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

export interface GLTFResult {
  animations: Array<AnimationClip>
  nodes: Record<string, TresObject3D>
  materials: Record<string, Material>
  scene: Scene
}

export async function useGLTF<T extends string | string[]>(
  path: T,
  options: GLTFLoaderOptions = { draco: false },
  extendLoader?: (loader: GLTFLoader) => void,
): Promise<T extends string[] ? GLTFResult[] : GLTFResult> {
  const dracoLoader = options.draco
    ? new DRACOLoader().setDecoderPath(options.decoderPath || 'https://www.gstatic.com/draco/versioned/decoders/1.4.3/')
    : null

  const gltfModel = (await useLoader(
    // @ts-expect-error I don't know why this does not error in the original @tresjs/core code...
    GLTFLoader,
    path,
    (loader: GLTFLoader) => {
      extendLoader?.(loader)

      if (dracoLoader) {
        loader.setDRACOLoader(dracoLoader)
      }
    },
  ))

  dracoLoader?.dispose()

  return gltfModel
}
