import { LinearLevelProgression } from '@/game-logic/building-classes/level-progression.js'
import type { BuildingClass } from '@/game-logic/building-classes/types.js'
import { CurrencyRecord } from '@/game-logic/currencies.js'

export const well: BuildingClass = {
  levelProgression: new LinearLevelProgression({
    buildingSeconds: {
      additionalPerLevel: 2.25,
      initial: 4,
    },
    costs: {
      additionalPerLevel: new CurrencyRecord({ gold: 2.5 }),
      initial: new CurrencyRecord({ gold: 7 }),
    },
    getModel: () => null, // TODO: provide real model
    income: {
      additionalPerLevel: new CurrencyRecord({ gold: 0.7 }),
      initial: new CurrencyRecord({ gold: 1.3 }),
    },
  }),
  maxInstances: 3,
  name: 'Very deep well',
}
