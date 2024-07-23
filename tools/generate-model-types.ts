import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
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

// Allow running this as a script.
if (fileURLToPath(import.meta.url) === argv[1]) {
  generateAllModelTypes()
}

export function generateAllModelTypes() {
  const models = getAllModels()

  for (const model of models) {
    const outputDir = resolve(typeOutputDirectory, dirname(model.filePath))
    const outputFilePath = resolve(outputDir, `${basename(model.filePath)}.d.ts`)

    const content = getAmbientModuleCode(model)

    mkdirSync(outputDir, { recursive: true })
    writeFileSync(outputFilePath, content, { encoding: 'utf-8' })
  }
}

interface Model {
  filePath: string
  name: string
}

export function getAllModels() {
  const allFiles = readdirSync(modelScanDirectory, { encoding: 'utf-8', recursive: true, withFileTypes: true })
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

function getAmbientModuleCode(model: Model) {
  const content = [
    ...getGeneratedTypeLines(model),
    '',
    `declare const modelLoader: PromiseLike<${model.name}>`,
    `export default modelLoader`,
  ].join('\n')

  return content
}

function getGeneratedTypeLines(model: Model) {
  const modelJson = JSON.parse(readFileSync(model.filePath, { encoding: 'utf-8' }))
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
