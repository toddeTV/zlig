import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'

const modelFileExtensions = ['.gltf']
const modelScanDirectory = join('src', 'assets')
const typeOutputDirectory = resolve('node_modules', '.tmp', 'model-types')

const topLevelKeyTypes: Partial<Record<string, string>> = {
  meshes: `import('three').Mesh`,
  nodes: `import('three').Object3D`,
  scenes: `import('three').Scene`,
}

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

async function getAmbientModuleCode(model: Model) {
  const content = [
    ...(await getGeneratedTypeLines(model)),
    '',
    `declare const modelLoader: PromiseLike<${model.name}>`,
    `export default modelLoader`,
  ].join('\n')

  return content
}

async function getGeneratedTypeLines(model: Model) {
  const modelJson = JSON.parse(await readFile(model.filePath, { encoding: 'utf-8' }))
  const topLevelKeysWithNamedArray = Object.entries(modelJson)
    .filter((entry): entry is [string, { name: string }[]] => {
      if (!Array.isArray(entry[1])) {
        return false
      }

      return entry[1].every(item => typeof item === 'object' && 'name' in item && typeof item.name === 'string')
    })

  const generatedType: string[] = []

  generatedType.push(`export interface ${model.name} {`)

  for (const [key, items] of topLevelKeysWithNamedArray) {
    const type = topLevelKeyTypes[key] ?? 'any'

    generatedType.push(`  ${key}: {`)

    for (const item of items) {
      generatedType.push(`    '${item.name}': ${type}`)
    }

    generatedType.push(`  }`)
  }

  generatedType.push(`}`)

  return generatedType
}
