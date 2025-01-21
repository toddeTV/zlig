import { useLogger } from '@tresjs/core'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
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
      logError(`[BundledDRACOLoader] Unknown DRACO file: ${url}`)
    }

    // @ts-expect-error This does not exist in the typings //TODO fix later
    return super._loadLibrary(url, responseType)
  }
}

const dracoLoader = new BundledDRACOLoader().preload()

const gltfLoader = new GLTFLoader().setDRACOLoader(dracoLoader)

export default gltfLoader
