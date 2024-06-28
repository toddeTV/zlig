# zlig

## project overview

This project represents a japanese style idle game.

Short project name: `zlig` (stands for `zen-landscape-idle-game`)

Current deployment on: (NONE)

## dev

### commands

- cleanup
  - `sudo rm -rf build dist .output .data`
  - `sudo rm -rf node_modules`

### initial setup

#### VM ID

Development VM ID from Thorsten Seyschab for this project: `0Z1`<br>
(Only interesting to him.)

#### system requirements for developing

The following softwares are required for development:<br>
(The versions listed were the ones I most recently used for development and testing. So try sticking with them.)

| software | command for version output                | my version at last use | information          |
| -------- | ----------------------------------------- | ---------------------- | -------------------- |
| Ubuntu   | `lsb_release -a` or `cat /etc/os-release` | v24.04 LTS             | OS                   |
| Linux    | `uname -r`                                | 6.8.0-35-generic       | Linux Kernel         |
| VSCode   | `code -v`                                 | 1.90.2                 | IDE                  |
| nvm      | `nvm -v`                                  | v0.39.7                | Node Version Manager |
| Node     | `node -v` (old `nodejs --version`)        | v20.11.1               | NodeJS/ Node.js      |
| npm      | `npm -v`                                  | v10.2.4                |                      |
| npx      | `npx -v`                                  | v10.2.4                |                      |
| pnpm     | `pnpm -v`                                 | v9.0.1                 |                      |

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
   If the browser to VSCode callback fails (e.g. due to remote working on a VM), wait for the login popup on the
   bottom right to timeout (ca. 5 minutes) and then on the upcoming popup question<br>
   `You have not yet finished authorizing [...] Would you like to try a different way? (local server)` click `Yes`
   and use this alternative login mechanic.
6. Rename `.env.example` to `.env` and set the environment variables.
7. Install dependencies: `pnpm i`
8. Happy coding <3

### lint and prettier

<!-- TODO -->

### Design

#### used icon collections

This project uses the following icon collections in descending order, try sticking to them and use from top to bottom.
Tipp: Favorite them and use the search over all item collections at once: https://icon-sets.iconify.design/?list=favorite

| full name               | shorthand | license                                                         | note           |
| ----------------------- | --------- | --------------------------------------------------------------- | -------------- |
| `phosphor`              | `ph`      | MIT                                                             |                |
| `Material Design Icons` | `mdi`     | Apache 2.0 (commercial use is allowed, no attribution required) |                |
| `Material Line Icons`   | `line-md` | MIT                                                             | animated icons |

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
import { ... } from '@tresjs/cientos'
import { ... } from '@tresjs/core'
import { ... } from '@tresjs/nuxt'
import { ... } from '@tresjs/post-processing'
import { ... } from 'three/src/[...].js'
</script>
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
      <TresDirectionalLight :position="[4, 8, 4]" :intensity="3.0" cast-shadow :shadow="directionalLightShadow" />
      <TresAmbientLight :intensity="0.3" />
      <!-- ... -->
    </TresCanvas>
  </Suspense>
</template>
```

### Docs and helper websites

- icon browser
  - [iconify](https://icon-sets.iconify.design/ph/) (not recommended, but really good)
  - [icones](https://icones.js.org/collection/ph) (recommended, but not so good)

## prod

<!-- TODO -->

## Attribution

Head of project:

- [Thorsten Seyschab](https://todde.tv)

Honorable mentions to people and projects that helped this project:

- [Franka Schlösser](https://github.com/saknarf) helped with the project. Thank you <3

## License

Private, only for Thorsten Seyschab.
For more information see [LICENSE](./LICENSE) file.
Copyright (c) 2024-present, [Thorsten Seyschab](https://todde.tv)
