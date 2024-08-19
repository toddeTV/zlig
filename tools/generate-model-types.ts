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
    throw error
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

interface gltfJsonType {
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

async function getGeneratedTypeLines(model: Model) {
  const gltfJson = JSON.parse(await readFile(model.filePath, { encoding: 'utf-8' })) as gltfJsonType

  const generatedType: string[] = []

  // meta interface export for the model
  generatedType.push(`export interface ${model.name} {`)

  // populate all keys
  generatedType.push(...getTypeForKey(gltfJson, 'animations'))
  generatedType.push(...getTypeForKey(gltfJson, 'asset'))
  generatedType.push(...getTypeForKey(gltfJson, 'parser'))
  generatedType.push(...getTypeForKey(gltfJson, 'scenes'))
  generatedType.push(...getTypeForKey(gltfJson, 'userData'))

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

  // end the interface export
  generatedType.push(`}`)

  return generatedType
}

function getTypeForKey(
  gltfJson: gltfJsonType,
  key: 'animations' | 'asset' | 'parser' | 'scenes' | 'userData',
) {
  switch (key) {
    case 'animations':
      return getTypeForKey_animations(gltfJson)
    case 'asset':
      return getTypeForKey_asset(gltfJson)
    case 'parser':
      return getTypeForKey_parser(gltfJson)
    case 'scenes':
      return getTypeForKey_scenes(gltfJson)
    case 'userData':
      return getTypeForKey_userData(gltfJson)
    default:
      // TODO fix
      // eslint-disable-next-line no-case-declarations
      const errMsg = `Error generating model types: ${key}`
      console.error(errMsg)
      throw new Error(errMsg)
  }
}

function getTypeForKey_animations(gltfJson: gltfJsonType) {
  return [
    `  animations: {`,
    ...(gltfJson.animations ?? []).map(
      animation => `    "${escapeKeyString(animation.name)}": import('three').AnimationClip`,
    ),
    `  }`,
  ]
}

function getTypeForKey_asset(gltfJson: gltfJsonType) {
  return [
    `  asset: {`,
    ...(gltfJson.asset?.copyright ? [`    copyright: string`] : []),
    ...(gltfJson.asset?.generator ? [`    generator: string`] : []),
    ...(gltfJson.asset?.version ? [`    version: string`] : []),
    ...(gltfJson.asset?.minVersion ? [`    minVersion: string`] : []),
    ...(gltfJson.asset?.extensions ? [`    extensions: any`] : []),
    ...(gltfJson.asset?.extras ? [`    extras: any`] : []),
    `  }`,
  ]
}

function getTypeForKey_parser(_gltfJson: gltfJsonType) {
  return [
    `  parser: import('three').GLTFParser`,
  ]
}

function getTypeForKey_scenes(gltfJson: gltfJsonType) {
  const generatedType: string[] = []

  generatedType.push(`  scenes: {`)
  for (const scene of gltfJson.scenes ?? []) {
    generatedType.push(
        `    "${escapeKeyString(scene.name)}": {`,
        `      name: string`,
        `      scene: import('three').Group`,
        ...getTypeForKey_scenes_Object(gltfJson, scene),
        ...getTypeForKey_scenes_Material(gltfJson, scene),
        ...getTypeForKey_scenes_Light(gltfJson, scene),
        ...getTypeForKey_scenes_Camera(gltfJson, scene),
        `    }`,
    )
  }
  generatedType.push(`  }`)

  return generatedType
}

function getTypeForKey_scenes_Object(gltfJson: gltfJsonType, scene: NonNullable<gltfJsonType['scenes']>[number]) {
  return [
    `      objects: {`,
    ...(gltfJson.nodes ?? []).filter(
      node => scene.nodes.includes(gltfJson.nodes!.indexOf(node)) && node.mesh !== undefined, // Meshes and Groups
    ).map((meshAndGroup) => {
      const meshAndGroupMeshes = gltfJson.meshes![meshAndGroup.mesh!]
      const importString = meshAndGroupMeshes.primitives.length <= 1
        ? `import('three').Mesh`
        : `import('three').Group`
      return `        "${escapeKeyString(meshAndGroup.name)}": ${importString}`
    }),
    `      }`,
  ]
}

function getTypeForKey_scenes_Material(gltfJson: gltfJsonType, scene: NonNullable<gltfJsonType['scenes']>[number]) {
  const generatedType: string[] = []
  generatedType.push(
    `      materials: {`,
  )
  const meshAndGroups = (gltfJson.nodes ?? []).filter(
    node => scene.nodes.includes(gltfJson.nodes!.indexOf(node)) && node.mesh !== undefined, // Meshes and Groups
  )
  const materials = new Set<number>()
  for (const meshAndGroup of meshAndGroups) {
    const meshAndGroupMeshes = gltfJson.meshes![meshAndGroup.mesh!]
    const flattenedMaterials = meshAndGroupMeshes.primitives.map(primitive => primitive.material)
    flattenedMaterials.forEach(material => materials.add(material))
  }
  generatedType.push(
    ...gltfJson.materials!.filter((material, index) => materials.has(index))
      .map(mat => `        "${escapeKeyString(mat.name)}": import('three').Material`),
    `      }`,
  )
  return generatedType
}

function getTypeForKey_scenes_Light(_gltfJson: gltfJsonType, _scene: NonNullable<gltfJsonType['scenes']>[number]) {
  return [
    // TODO add the correct typed lights, currently this is too much work for the scope of the project, and
    // also the fallback at the end will catch this -> so it works, it only is not typed
    `      lights: Record<String, import('three').Light>`,
  ]
}

function getTypeForKey_scenes_Camera(gltfJson: gltfJsonType, scene: NonNullable<gltfJsonType['scenes']>[number]) {
  return [
    `      cameras: {`,
    ...(gltfJson.nodes ?? []).filter(
      node => scene.nodes.includes(gltfJson.nodes!.indexOf(node)) && node.camera !== undefined,
    ).map(camera => `        "${escapeKeyString(camera.name)}": import('three').Camera`),
    `      }`,
  ]
}

function getTypeForKey_userData(_gltfJson: gltfJsonType) {
  return [
    `  userData: Record<string, any>`,
  ]
}
