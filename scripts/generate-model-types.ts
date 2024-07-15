import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'

if (fileURLToPath(import.meta.url) === argv[1]) {
  generateModelTypes()
}

interface GenerateModelTypesInput {
  modelFileExtensions?: string[]
  scanFolder?: string
  topLevelKeyTypes?: Record<string, string>
  outputDirectory?: string
}

function generateModelTypes({
  modelFileExtensions = ['.gltf'],
  outputDirectory = resolve('node_modules', '.tmp', 'model-types'),
  scanFolder = resolve('public'),
  topLevelKeyTypes = {},
}: GenerateModelTypesInput = {}) {
  const DEFAULT_TOP_LEVEL_KEY_TYPES = {
    meshes: `import('three').Mesh`,
    nodes: `import('three').Object3D`,
    scenes: `import('three').Scene`,
  }

  topLevelKeyTypes = { ...DEFAULT_TOP_LEVEL_KEY_TYPES, ...topLevelKeyTypes }

  mkdirSync(outputDirectory, { recursive: true })

  const models = getAllModels(scanFolder, modelFileExtensions)

  for (const model of models) {
    const moduleName = relative(scanFolder, model.filePath)
    const outputFilePath = resolve(outputDirectory, `${model.name}.d.ts`)

    const content = [
      `declare module '${moduleName}' {`,
      ...getGeneratedTypeLines(model.name, model.filePath, topLevelKeyTypes).map(l => `  ${l}`),
      '',
      `  const modelLoader: PromiseLike<${model.name}>`,
      `  export default modelLoader`,
      `}`,
    ].join('\n')

    writeFileSync(outputFilePath, content, { encoding: 'utf-8' })
  }
}

interface Model {
  filePath: string
  name: string
}

function getAllModels(scanFolder: string, modelFileExtensions: string[]) {
  const allFiles = readdirSync(scanFolder, { encoding: 'utf-8', recursive: true, withFileTypes: true })
  const models: Model[] = []

  for (const file of allFiles) {
    if (!file.isFile()) { continue }

    const ext = modelFileExtensions.find(ext => file.name.endsWith(ext))
    if (!ext) { continue }

    models.push({
      filePath: resolve(file.parentPath, file.name),
      name: file.name.replace(ext, ''),
    })
  }

  return models
}

function getGeneratedTypeLines(modelName: string, modelFilePath: string, topLevelKeyTypes: Partial<Record<string, string>>) {
  const modelJson = JSON.parse(readFileSync(modelFilePath, { encoding: 'utf-8' }))
  const topLevelKeysWithNamedArray = Object.entries(modelJson)
    .filter((entry): entry is [string, { name: string }[]] => {
      if (!Array.isArray(entry[1])) { return false }

      return entry[1].every(item => typeof item === 'object' && 'name' in item && typeof item.name === 'string')
    })

  const generatedType: string[] = []

  generatedType.push(`interface ${modelName} {`)

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
