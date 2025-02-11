import { type Group, Object3D, type Scene } from 'three'

export function getLeafObjects(object: Object3D): Object3D[] {
  if (object.children.length === 0) {
    return [object]
  }
  return object.children.flatMap(child => getLeafObjects(child))
}

export function addShadow(
  object: Object3D,
  shadowMode: 'both' | 'cast' | 'receive' = 'both',
) {
  object.traverse((child) => {
    if (child instanceof Object3D) {
      if (shadowMode === 'both' || shadowMode === 'cast') {
        child.castShadow = true
      }
      if (shadowMode === 'both' || shadowMode === 'receive') {
        child.receiveShadow = true
      }
    }
  })
}

export function addToGroup(
  group: Scene | Group | Object3D,
  object: Object3D,
) {
  group.add(object)
}

export function addShadowAndAddToGroup(
  group: Scene | Group | Object3D,
  object: Object3D,
  shadowMode: 'both' | 'cast' | 'receive' = 'both',
) {
  addShadow(object, shadowMode)
  addToGroup(group, object)
}
