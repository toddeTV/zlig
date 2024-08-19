import { trasverseObjects, useLogger } from '@tresjs/core'
import type { AnimationClip, Camera, Group, Light, Material, Object3D } from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import type { GLTFParser } from 'three/addons/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import decoderUrl from 'three/examples/jsm/libs/draco/draco_decoder.js?url'
import wasmUrl from 'three/examples/jsm/libs/draco/draco_decoder.wasm?url'
import wasmWrapperUrl from 'three/examples/jsm/libs/draco/draco_wasm_wrapper.js?url'

/*
The DRACOLoader uses extra files for decoding the model files. These files are loaded at runtime based on some
settings and browser capabilities. For this, the original loader accepts a base URL and appends the file names to it.
While this works it is rather cumbersome to include the files that are supplied by the three.js project without
manual build steps.
To ease the process we take advantage of vite/rollup to allow bundling files and return the url to the asset. In the
following subclass we override the known file names to paths that resolve to the assets after the build step.
*/

class BundledDRACOLoader extends DRACOLoader {
  _loadLibrary(url: string, responseType: string) {
    const { logError } = useLogger()

    if (url === 'draco_decoder.js') {
      url = decoderUrl
    }
    else if (url === 'draco_wasm_wrapper.js') {
      url = wasmWrapperUrl
    }
    else if (url === 'draco_decoder.wasm') {
      url = wasmUrl
    }
    else {
      logError(`[useGLTF] Unknown DRACO file: ${url}`)
    }

    // @ts-expect-error This does not exist in the typings //TODO fix later
    return super._loadLibrary(url, responseType)
  }
}

const dracoLoader = new BundledDRACOLoader().preload()

const gltfLoader = new GLTFLoader().setDRACOLoader(dracoLoader)

/**
 * The values here must be the same as in `/tools/generate-model-types.ts`.
 * The return after loading the GLTF model is:
 *   `import { type GLTF } from 'three/addons/loaders/GLTFLoader.js'`
 * But we want to return a more specific type with also additional values, so we have to redefine it here.
 */
export interface GLTFResult {
  // keys also present in `GLTF` but probably with different types
  animations: Record<string, AnimationClip>
  asset: {
    copyright?: string | undefined
    generator?: string | undefined
    version?: string | undefined
    minVersion?: string | undefined
    extensions?: any
    extras?: any
  }
  // cameras: Camera[]
  parser: GLTFParser
  // scene: Group
  scenes: Record<string, {
    // redundant bc already present in `Scene.children`, but needed for later typing bc `children` is an array
    // and no object with named keys
    name: string
    scene: Group
    objects: Record<string, Object3D>
    materials: Record<string, Material>
    light: Record<string, Light>
    cameras: Record<string, Camera>
  }>
  userData: Record<string, any>
}

/**
 * Loads a GLTF model from the specified path.
 * The path must be in the `public` folder and so be accessible directly from the browser.
 * The model must be in the GLTF format.
 *
 * example use: `const { animations, asset, [...] } = await useGLTF('/Bridge/Bridge.gltf')`
 *
 * It is not recommended to use this function directly, but better use the auto generated types, see `README.md`.
 *
 * [Important] This function converts arrays with objects that contains `name` as property in objects
 * with the `name` as key. But it ignores duplicated names and overwrites them without checking. So be
 * careful and only use models that does not have duplicated names.
 */
export default async function (
  path: string,
): Promise<GLTFResult> {
  const { logError } = useLogger()

  return new Promise<GLTFResult>((resolve, reject) => {
    gltfLoader.load(path, (model) => {
      // remodel some arrays to objects with the names as keys
      const animations: GLTFResult['animations'] = convertArrayToObject(model.animations)

      // modify `scenes`
      const modifiedScenes = model.scenes.map((scene) => {
        const sceneTraversed = trasverseObjects(scene) // could contain `materials`, `nodes`, ...
        const sceneObj = {
          Scene: scene,
          name: scene.name,
        }
        if (sceneTraversed.materials) {
          sceneObj.Material = sceneTraversed.materials
        }
        if (sceneTraversed.nodes) {
          for (const [nodeKey, nodeValue] of Object.entries(sceneTraversed.nodes)) {
            // do not add the scene itself
            if (nodeValue.uuid === scene.uuid) {
              continue
            }

            // the key is only allowed to be set once
            let key: string | undefined

            // Object = Mesh & Group
            if (key === undefined && (nodeValue.type === 'Mesh' || nodeValue.type === 'Group')) {
              key = 'Object'
            }

            // Light
            if (key === undefined && nodeValue.isLight === true) {
              key = 'Light'
            }

            // Camera
            if (key === undefined && nodeValue.isCamera === true) {
              key = 'Camera'
            }

            // everything else that has not been handled yet
            if (key === undefined) {
              key = nodeValue.type
            }

            // ensure that the key exists
            if (!sceneObj[key]) {
              sceneObj[key] = {}
            }

            // add the data
            sceneObj[key][nodeKey] = nodeValue
          }
        }
        return sceneObj
      })
      const scenes: GLTFResult['scenes'] = convertArrayToObject(modifiedScenes)

      // put all together in the new model
      const newModel: GLTFResult = {
        animations,
        asset: model.asset,
        parser: model.parser,
        scenes,
        userData: model.userData,
      }

      // resolve with the new model
      resolve(newModel)
    }, undefined, event => reject(logError('[useGLTF] Failed to load resource', event)))
  })
}

function convertArrayToObject<T extends { name: string }>(array: T[]): Record<string, T> {
  const object: Record<string, T> = {}
  for (const item of array) {
    object[item.name] = item
  }
  return object
}
