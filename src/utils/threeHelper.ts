import { type Group, Mesh, Object3D, type Scene, UniformsUtils, Vector3, type WebGLProgramParametersWithUniforms } from 'three'

export function getLeafObjects(object: Object3D): Object3D[] {
  if (object.children.length === 0) {
    return [object]
  }
  const children = object.children.flatMap(child => getLeafObjects(child))
  return children
}

export function getAllObjects(object: Object3D): Object3D[] {
  if (object.children.length === 0) {
    return [object]
  }
  const children = object.children.flatMap(child => getAllObjects(child))
  return [object, ...children]
}

export function addShadow(
  object: Object3D,
  shadowMode: 'both' | 'cast' | 'receive' = 'both',
) {
  // if (object.children.length > 0) {
  //   object.children.forEach(child => addShadow(child))
  //   return
  // }
  // if (shadowMode === 'both' || shadowMode === 'cast') {
  //   object.castShadow = true
  // }
  // if (shadowMode === 'both' || shadowMode === 'receive') {
  //   object.receiveShadow = true
  // }
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

export function removeFogDependence(
  object: Object3D,
) {
  object.traverse((child) => {
    if (child instanceof Mesh) {
      child.material.fog = false
    }
  })
}

export function addToGroup(
  group: Scene | Group | Object3D,
  object: Object3D,
  objectEnableFog = false,
) {
  if (objectEnableFog === false) {
    removeFogDependence(object)
  }
  group.add(object)
}

export function addShadowAndAddToGroup(
  group: Scene | Group | Object3D,
  object: Object3D,
  shadowMode: 'both' | 'cast' | 'receive' = 'both',
  objectEnableFog = false,
) {
  addShadow(object, shadowMode)
  addToGroup(group, object, objectEnableFog)
}

export function overrideFogShader(
  shader: WebGLProgramParametersWithUniforms,
  fogCenter = new Vector3(0, 0, 0),
  fogDistanceOffset = 0,
) {
  shader.vertexShader = shader.vertexShader.replace(
    `#include <fog_pars_vertex>`,
    `#include <fog_pars_vertex>
      #ifdef USE_FOG
      // the center of the fog is set here, but bc it is the world center, we do not have do do anything
      uniform vec3 fogCenter;
      #endif
      `,
  )
  shader.vertexShader = shader.vertexShader.replace(
    `#include <project_vertex>`,
    `
      #ifdef USE_FOG
      vec3 vertexWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
      vFogDepth = distance(fogCenter.xz, vertexWorldPosition.xz) + ${fogDistanceOffset.toFixed(1)};
      #endif
      
      #include <project_vertex>`,
  )
  shader.vertexShader = shader.vertexShader.replace(
    `#include <fog_vertex>`,
    ``,
  )

  const uniforms = ({
    fogCenter: { value: fogCenter },
  })

  shader.uniforms = UniformsUtils.merge([shader.uniforms, uniforms])
}
