import Big from 'big.js'
import { LinearLevelProgression } from '@/game-logic/buildings/level-progression.js'
import type { BuildingType } from '@/game-logic/buildings/types.js'
import { ResourceRecord } from '@/game-logic/resources.js'

export const well: BuildingType = {
  levelProgression: new LinearLevelProgression({
    buildingSeconds: {
      additionalPerLevel: 2.25,
      initial: 4,
    },
    costs: {
      additionalPerLevel: new ResourceRecord({ gold: new Big('2.5') }),
      initial: new ResourceRecord({ gold: new Big('7') }),
    },
    getModel: () => null, // TODO: provide real model
    income: {
      additionalPerLevel: new ResourceRecord({ gold: new Big('0.7') }),
      initial: new ResourceRecord({ gold: new Big('1.3') }),
    },
  }),
  maxInstances: 3,
  name: 'Very deep well',
}