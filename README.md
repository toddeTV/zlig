# zlig

## project overview

This project represents a japanese style idle game.

Short project name: `zlig` (stands for `zen-landscape-idle-game`)

Current deployment on:

- production
  - branch `main`: [https://zlig.net/](https://zlig.net/)<br>
    (This is a custom domain for [https://zlig.vercel.app/](https://zlig.vercel.app/))
- development
  - branch `dev`: [https://zlig-git-dev-toddetv-projects.vercel.app/](https://zlig-git-dev-toddetv-projects.vercel.app/)
  - each PR will get a individual custom URL automatically

## dev

### commands

- cleanup
  - `sudo rm -rf build dist .output .data`
  - `sudo rm -rf node_modules`

### initial setup

#### VM ID

Development VM ID from Thorsten Seyschab for this project: `014`<br>
(Only interesting to him.)

#### system requirements for developing

The following softwares are required for development:<br>
(The versions listed were the ones I most recently used for development and testing. So try sticking with them.)

| software | command for version output                | my version at last use | information          |
| -------- | ----------------------------------------- | ---------------------- | -------------------- |
| Ubuntu   | `lsb_release -a` or `cat /etc/os-release` | 22.04.4 LTS            | OS                   |
| Linux    | `uname -r`                                | 5.15.0-119-generic     | Linux Kernel         |
| VSCode   | `code -v`                                 | 1.93.2                 | IDE                  |
| nvm      | `nvm -v`                                  | v0.39.7                | Node Version Manager |
| Node     | `node -v` (old `nodejs --version`)        | v20.16.0               | NodeJS/ Node.js      |
| npm      | `npm -v`                                  | v10.8.1                |                      |
| npx      | `npx -v`                                  | v10.8.1                |                      |
| pnpm     | `pnpm -v`                                 | v9.10.0                |                      |

In the browser install:

- [VueJS Devtools](https://devtools.vuejs.org/guide/installation.html)

#### project setup

1. execute a `git pull`
2. open project in VSCode
3. If you work with VSCode via remote software:
   - `{Ctrl}+{Shift}+{P}` -> `>Preferences: Open Settings (UI)` -> search for `keyboard.dispatch` and set it to `keyCode`
   - Restart or reload VSCode.
4. Install recommended extensions/ plugins:
   - Open Extensions menu in VSCode (`{Ctrl}+{Shift}+{X}`)
   - type in the search `@recommended`
   - install and enable the plugins
   - see file `.vscode/extensions.json` for configuring some of the extensions
   - Restart or reload VSCode.
5. In VSCode on the bottom left click your profile image and log in all services (GitHub due to VSCode extensions, ...)<br>
   If the browser to VSCode callback fails, wait for the login popup on the bottom right to timeout (ca. 5 minutes) and
   then on the upcoming popup question `You have not yet finished authorizing [...] Would you like to try a different way? (local server)` click `Yes` and use this alternative login mechanic.<br>
   (When you do not want to wait for the timeout to happen, you can also click the `Cancel` to trigger the dialog faster.)
6. Install dependencies: `pnpm i`
7. Happy coding <3

### lint and prettier

This project uses [antfu/eslint-config](https://github.com/antfu/eslint-config) for eslint most of the files.
The following extend it:

- [antfu/eslint-plugin-format](https://github.com/antfu/eslint-plugin-format) for using external formatters like
  e.g. `prettier` for the file types that eslint cannot handle.
- [azat-io/eslint-plugin-perfectionist](https://github.com/azat-io/eslint-plugin-perfectionist) for
  sorting object keys, imports, etc. - with auto-fix.

Keep in mind that the plugin names are renamed, see
[Plugins Rename](https://github.com/antfu/eslint-config?tab=readme-ov-file#plugins-renaming), e.g.:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

[Why I don't use Prettier for every file type](https://antfu.me/posts/why-not-prettier)

### Design

#### used icon collections

This project uses the following icon collections in descending order, try sticking to them and use from top to bottom.
Tipp: Favorite them and use the search over all item collections at once: https://icon-sets.iconify.design/?list=favorite

| full name               | shorthand | license                                                         | note           |
| ----------------------- | --------- | --------------------------------------------------------------- | -------------- |
| `phosphor`              | `ph`      | MIT                                                             |                |
| `Material Design Icons` | `mdi`     | Apache 2.0 (commercial use is allowed, no attribution required) |                |
| `Material Line Icons`   | `line-md` | MIT                                                             | animated icons |

### Blender

Models are created using [Blender](https://www.blender.org/).

#### glTF export with draco compression

Use [draco compression](https://github.com/google/draco) in [Blender](https://www.blender.org/) on
[glTF 2](https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/README.md) files:

1. Create the model in blender
2. Go to `File` -> `Export` -> `glTF 2.0 (.glb/.gltf)`
3. In the right side panel
   1. set `Format` to `glTF Seperate (.gltf + .bin + textures)`
   2. set `Remember Export Settings` to `true`
   3. under `Data` set `Compression` to `true`
   4. under `Compression` set the compression level between 0-6 (0=less compression; 6=strongest compression)<br>
      I am using `6` most of the time - only when morphing between models, this should be set to `0`.

### TresJS & ThreeJS

#### possible import locations

Do **not** import from `three` directly but from the direct source instead. Example:

```diff
-import { MeshLambertMaterial } from 'three'
+import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial.js'
```

Seems to work for types, but better use the direct import from the source folder (see above):

```vue
<script setup lang="ts">
import type * as THREE from 'three'
</script>
```

```vue
<script setup lang="ts">
import { something } from '@tresjs/cientos'
import { something } from '@tresjs/core'
// import { something } from '@tresjs/nuxt'
// import { something } from '@tresjs/post-processing'
import { something } from 'three'
import { something } from 'three/src/[...].js'
import { something } from 'three-stdlib'
</script>
```

#### import and use `*.gltf` model files

_Method 1: With direct useGLTF_

```vue
<script setup lang="ts">
import useGLTF from '@/composables/useGLTF'

const { scenes } = await useGLTF('/MyModel/MyModel.gltf')
</script>

<template>
  <primitive :object="scenes.someScene" />
</template>
```

- All `*.gltf` models, along with their corresponding `*.bin` and texture files, are located in `/public/`.
  The `useGLTF` fetches it over HTTP
- Bc of gltf-files present in the public folder, all gltf files are always bundled in the final app on build,
  regardless whether they are used or not.
- no types
- Direct call of `useGLTF`, no extra layers or wrappers

---

_Method 2: With generated helper wrappers and type definitions_

```vue
<script setup lang="ts">
import modelLoader from '@/assets/models/someSubfolder/someModel.gltf'

const { scenes } = await modelLoader
</script>

<template>
  <primitive :object="scenes.someScene" />
</template>
```

- All `*.gltf` models, along with their corresponding `*.bin` and texture files, are located in `/src/assets/models/`.
- To generate helper wrappers and type definitions, run:

  ```sh
  pnpm run generate:gltf-models
  ```

  This script scans all model files in the source folder, deconstructs the GLTF JSON representation, and places
  the generated types in `./node_modules/.tmp/model-types/`, ensuring only imported models are included in the
  final product.

  The script runs automatically:

  - always a `.gltf` file changes
  - before a dev run
  - before a build
  - after `pnpm i`

- Nearly type safe GLTF file representations.<br>
  Importing models is type-safe, and builds will fail if a model is missing.
- Only the used models are bundled in the final product.
- On runtime: Runs `useGLTF` under the hood. So 100% correct objects and usage, no extra layer.<br>
  In dev: Scans the `*.gltf` file on its own, so the generated typing has redundant code and could be different
  from what is present on runtime. So be careful when using and test/ double check it!<br>
  Example: In `gltfModel.scenes.someScene.traversed.Object` the typing only hints real objects and not each
  primitive that is used to build up the objects. But in runtime these primitives are also present in the
  `traversed.Object` - but funnily enough not all ... that is the reason I left away all primitives, just to be sure.

#### Multiple instances of the same model

For already loaded and parsed models the GLTF loader returns a cached version. So `primitive` uses then the same
model which means the single instance is unmounted and mounted again with other coordinates.

Solution: clone it

```vue
<script setup lang="ts">
// ...
const model = scenes.someScene.Object.someObject.clone()
</script>

<template>
  <primitive :object="model" />
</template>
```

#### real time shadows

Example shadow configuration below.
The so generated shadows currently have heavy artifacts, so we bake the shadows in this project.
But here is an example configuration for shadows:

```vue
<script setup lang="ts">
import { DirectionalLightShadow } from 'three/src/lights/DirectionalLightShadow.js'

nodes.MyObject.castShadow = true
nodes.MyObject.receiveShadow = true
nodes.MyGroundPlane.receiveShadow = true

const directionalLightShadow = new DirectionalLightShadow()
directionalLightShadow.mapSize.width = 4096
directionalLightShadow.mapSize.height = 4096
directionalLightShadow.normalBias = 0.1
directionalLightShadow.bias = 0.002
</script>

<template>
  <Suspense>
    <TresCanvas shadows>
      <!-- ... -->
      <TresDirectionalLight
        cast-shadow
        :intensity="3.0"
        :position="[4, 8, 4]"
        :shadow="directionalLightShadow"
      />
      <TresAmbientLight :intensity="0.3" />
      <!-- ... -->
    </TresCanvas>
  </Suspense>
</template>
```

#### postprocessing

Normally, you could use the packages `@tresjs/post-processing` and `postprocessing` in combination for postprocessing
TresJS/ ThreeJS. Unfortunately, they are currently not compatible with TresJS core >v4, see
[comment on issue #16](https://github.com/toddeTV/zlig/issues/16#issuecomment-2246317999) and
[issue #32](https://github.com/toddeTV/zlig/issues/32).

### Docs and helper websites

- icon browser
  - [iconify](https://icon-sets.iconify.design/ph/) (not recommended, but really good)
  - [icones](https://icones.js.org/collection/ph) (recommended, but not so good)
- [TailwindCSS cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [TresJS docs](https://docs.tresjs.org/guide/)

## prod

Will use the build command out of `/package.json`.<br>
Building, deploying and hosting is done via [Vercel](https://vercel.com/toddetv-projects/zlig).

## Attribution/ Contribution

Head of project:

- [Thorsten Seyschab](https://todde.tv)

Honorable mentions to people and projects that helped this project:

- [Andreas Fehn](https://github.com/fehnomenal) helped with the project. Thank you <3
- [Moritz Starke](https://github.com/Myzios) helped with general 3D and Blender questions. Thanks mate <3

Used services, dependencies and materials - besides the ones in `./package.json`:

- [Low Poly Japanese Restaurant props & environment pack](https://www.artstation.com/marketplace/p/yB0RG/low-poly-japanese-restaurant-props-environment-pack)
- [GitHub Copilot](https://github.com/features/copilot) was used in private mode for programming questions.

## License

Private, only for Thorsten Seyschab.
For more information see [LICENSE](./LICENSE) file.
Copyright (c) 2024-present, [Thorsten Seyschab](https://todde.tv)
