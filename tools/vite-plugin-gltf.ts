import { Buffer } from 'node:buffer'
import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, relative, resolve } from 'node:path'
import type { Plugin } from 'vite'
import { generateAllModelTypes } from './generate-model-types'

const FILE_EXTENSION = '.gltf'

export function gltf(): Plugin {
  let isBuild: boolean

  return {
    async  buildStart() {
      await generateAllModelTypes()
    },

    configResolved(config) {
      isBuild = config.command === 'build'
    },

    generateBundle(_options, bundle) {
      // This hook is only called during building not during dev. Here we have to replace the file placeholders with
      // the actual file names. We need to do this manually as rollup only handles them in JS code automatically.

      for (const [file, output] of Object.entries(bundle)) {
        // Only do this for our emitted glTF assets.
        if (output.type === 'asset' && file.endsWith(FILE_EXTENSION)) {
          // Convert source to a string.
          const source = typeof output.source === 'string' ? output.source : Buffer.from(output.source).toString()

          output.source = replaceFilePlaceholders(source, (_, ref) =>
            // We need this leading slash as the glTF loader resolves the file name relative to the glTF file's path
            // and takes absolute paths into account. Rollup gives us a root relative path but without the leading
            // slash so we need to add it ourselves.
            `"/${this.getFileName(ref)}"`)
        }
      }
    },

    name: 'gltf',

    async transform(code, id) {
      if (!id.endsWith(FILE_EXTENSION)) {
        return
      }

      // glTF files may contain references to other binary files. AFAIK these are under the keys `buffers` and `images`
      // and have the key `uri`. This can be a path or an inline data uri.
      // See: https://www.khronos.org/files/gltf20-reference-guide.pdf

      // All model files and referenced files need to be emitted as assets. During dev emitting files does not make
      // sense (see https://github.com/vitejs/vite/issues/7029) and thus this hook needs to work differently between
      // dev and build.

      if (!isBuild) {
        // During dev simply return a js module that loads the file. The loader correctly resolves the referenced files
        // relative to the main model file.

        const relativePath = relative(resolve('.'), id)

        return gltfLoaderCode(JSON.stringify(relativePath))
      }

      // During build emit (or bundle depending on the setting) the main model file and emit all referenced files. We
      // need to find those references, emit them as assets and update the references to the assets.

      const gltf = JSON.parse(code)

      for (const key of ['buffers', 'images']) {
        const items = gltf[key] as object[] ?? []

        for (const item of items) {
          if ('uri' in item && typeof item.uri === 'string') {
            if (item.uri.startsWith('data:')) {
              // Skip this for now.
              continue
            }

            // Check whether it references an existing file.
            const file = resolve(dirname(id), item.uri)
            if (!existsSync(file)) {
              // Just give up...
              continue
            }

            const ref = this.emitFile({
              name: `models/${basename(file)}`,
              source: readFileSync(file),
              type: 'asset',
            })

            // This placeholder will be replaced in a later build stage. We need to do this manually as rollup only
            // handles this automatically in JS code.
            item.uri = `import.meta.ROLLUP_FILE_URL_${ref}`
          }
        }
      }

      // Emit the model asset...
      const ref = this.emitFile({
        name: `models/${basename(id)}`,
        source: JSON.stringify(gltf),
        type: 'asset',
      })

      // ... and pass the path to the file. In this case rollup replaces the placeholder for us.
      return gltfLoaderCode(`import.meta.ROLLUP_FILE_URL_${ref}`)
    },

    async watchChange(id) {
      if (id.endsWith(FILE_EXTENSION)) {
        await generateAllModelTypes()
      }
    },
  }
}

const filePlaceholderRegex = /"(import.meta.ROLLUP_FILE_URL_(.+?))"/g
function replaceFilePlaceholders(input: string, replacer: (withoutQuotes: string, ref: string) => string) {
  return input.replaceAll(filePlaceholderRegex, (_, withoutQuotes, ref) => replacer(withoutQuotes, ref))
}

function gltfLoaderCode(input: string) {
  return `
    import useGLTF from '@/composables/useGLTF'

    export default useGLTF(${input})
  `
}
