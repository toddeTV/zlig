import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'

const modelFileExtensions = ['.gltf']
const modelScanDirectory = join('src', 'assets')
const typeOutputDirectory = resolve('node_modules', '.tmp', 'model-types')

// Also allow running this as a script besides allowing to import this module.
if (fileURLToPath(import.meta.url) === argv[1]) {
  await generateAllModelTypes()
}

export async function generateAllModelTypes() {
  const models = await getAllModels()

  if (models.length === 0) {
    return
  }

  try {
    await Promise.all(models.map(async (model) => {
      const outputDir = resolve(typeOutputDirectory, dirname(model.filePath))
      const outputFilePath = resolve(outputDir, `${basename(model.filePath)}.d.ts`)

      const content = await getAmbientModuleCode(model)

      await mkdir(outputDir, { recursive: true })
      await writeFile(outputFilePath, content, { encoding: 'utf-8' })
    }))

    // eslint-disable-next-line no-console
    console.log(`Generated types for ${models.length} model${models.length > 1 ? 's' : ''}.`)
  }
  catch (error) {
    console.error('Error generating model types:', error)
  }
}

interface Model {
  filePath: string
  name: string
}

async function getAllModels() {
  const allFiles = await readdir(modelScanDirectory, { encoding: 'utf-8', recursive: true, withFileTypes: true })
  const models: Model[] = []

  for (const file of allFiles) {
    if (!file.isFile()) {
      continue
    }

    const ext = modelFileExtensions.find(ext => file.name.endsWith(ext))
    if (!ext) {
      continue
    }

    const fullPath = resolve(file.parentPath, file.name)
    const projectRelativePath = join(modelScanDirectory, relative(modelScanDirectory, fullPath))

    models.push({
      filePath: projectRelativePath,
      name: file.name.replace(ext, ''),
    })
  }

  return models
}

/**
 * The result here must be the same as in `useGLTF.ts`.
 */
async function getAmbientModuleCode(model: Model) {
  const content = [
    ...(await getGeneratedTypeLines(model)),
    '',
    `declare const modelLoader: PromiseLike<${model.name}>`,
    `export default modelLoader`,
  ].join('\n')

  return content
}

function escapeKeyString(key: string) {
  return key.replaceAll('"', '\\"').replaceAll('.', '')
}

async function getGeneratedTypeLines(model: Model) {
  const modelJson = JSON.parse(await readFile(model.filePath, { encoding: 'utf-8' })) as {
    animations?: {
      name: string
    }[]
    asset: {
      copyright?: string | undefined
      generator?: string | undefined
      version?: string | undefined
      minVersion?: string | undefined
      extensions?: any
      extras?: any
    }
    nodes?: {
      name: string
      mesh?: number
      camera?: number
    }[]
    scenes?: {
      name: string
      nodes: number[]
    }[]
    meshes?: {
      name: string
      primitives: {
        material: number
      }[]
    }[]
    materials?: any[]
    cameras?: any[]
  }

  const generatedType: string[] = []

  generatedType.push(`export interface ${model.name} {`)

  // `animations`
  generatedType.push(`  animations: {`)
  if (modelJson.animations !== undefined) {
    generatedType.push(
      ...(modelJson.animations).map(
        animation => `    "${escapeKeyString(animation.name)}": import('three').AnimationClip`,
      ),
    )
  }
  generatedType.push(`  }`)

  // `asset`
  generatedType.push( // hardcoded, could check what keys are really present //TODO
    `  asset: {`,
    `    copyright?: string | undefined`,
    `    generator?: string | undefined`,
    `    version?: string | undefined`,
    `    minVersion?: string | undefined`,
    `    extensions?: any`,
    `    extras?: any`,
    `  }`,
  )

  // `parser`
  generatedType.push(`  parser: import('three').GLTFParser`)

  // `scenes`
  generatedType.push(`  scenes: {`)
  if (modelJson.scenes !== undefined) {
    for (const scene of modelJson.scenes) {
      generatedType.push(
        `    "${escapeKeyString(scene.name)}": import('three').Group & {`,
        `      traversed: {`,
        `        Object: {`,
      )
      if (modelJson.nodes !== undefined && modelJson.meshes !== undefined) {
        generatedType.push(
          ...modelJson.nodes.filter(
            node => scene.nodes.includes(modelJson.nodes!.indexOf(node)) && node.mesh !== undefined,
          ).map((meshAndGroup) => {
            const meshAndGroupMeshes = modelJson.meshes![meshAndGroup.mesh!]
            const importString = meshAndGroupMeshes.primitives.length <= 1
              ? `import('three').Mesh`
              : `import('three').Group`
            return `          "${escapeKeyString(meshAndGroup.name)}": ${importString}`
          }),
        )
      }
      generatedType.push(
        `        }`,
        `        Material: {`,
      )
      if (modelJson.nodes !== undefined && modelJson.meshes !== undefined) {
        const meshAndGroups = modelJson.nodes.filter(
          node => scene.nodes.includes(modelJson.nodes!.indexOf(node)) && node.mesh !== undefined,
        )
        const materials = new Set<number>()
        for (const meshAndGroup of meshAndGroups) {
          const meshAndGroupMeshes = modelJson.meshes![meshAndGroup.mesh!]
          const flattenedMaterials = meshAndGroupMeshes.primitives.map(primitive => primitive.material)
          flattenedMaterials.forEach(material => materials.add(material))
        }
        generatedType.push(
          ...modelJson.materials!.filter((material, index) => materials.has(index))
            .map(mat => `          "${escapeKeyString(mat.name)}": import('three').Material`),
        )
      }
      generatedType.push(
        `        }`,
        // TODO add the correct typd lights, currently this is too much work for the scope of the project, and also
        // the fallback at the end will catch this -> so it works, it only is not typed
        `        Light: Record<String, import('three').Light>`,
        `        Camera: {`,
      )
      if (modelJson.nodes !== undefined && modelJson.cameras !== undefined) {
        generatedType.push(
          ...modelJson.nodes.filter(
            node => scene.nodes.includes(modelJson.nodes!.indexOf(node)) && node.camera !== undefined,
          ).map(meshAndGroup => `          "${escapeKeyString(meshAndGroup.name)}": import('three').Camera`),
        )
      }
      generatedType.push(
        `        }`,
        `        [key: string]: Record<string, any>`,
        `      }`,
        `    }`,
      )
    }
  }
  generatedType.push(`  }`)

  // `userData`
  generatedType.push(`  userData: Record<string, any>`)

  // for (const [key, type] of Object.entries({
  //   materials: 'any',
  // })) {
  //   if (key in modelJson) {
  //     generatedType.push(
  //       `  ${key}: {`,
  //       ...(modelJson[key] as NamedItems).map(item => `    "${escapeKeyString(item.name)}": ${type}`),
  //       `  }`,
  //     )
  //   }
  // }

  generatedType.push(`}`)

  return generatedType
}
