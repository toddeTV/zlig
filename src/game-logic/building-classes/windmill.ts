import { FixedLevelProgression } from '@/game-logic/building-classes/level-progression.js'
import type { BuildingClass } from '@/game-logic/building-classes/types.js'
import { CurrencyRecord } from '@/game-logic/currencies.js'

export const windmill: BuildingClass = {
  levelProgression: new FixedLevelProgression([
    {
      baseBuildingSeconds: 5.5,
      baseCosts: new CurrencyRecord({ gold: 15 }),
      baseIncomePerSecond: new CurrencyRecord({ gold: 1 }),
      model: null, // TODO: provide real model
    },
    {
      baseBuildingSeconds: 4,
      baseCosts: new CurrencyRecord({ gold: 7 }),
      baseIncomePerSecond: new CurrencyRecord({ gold: 1.5 }),
    },
    {
      baseBuildingSeconds: 7,
      baseCosts: new CurrencyRecord({ gold: 12 }),
      baseIncomePerSecond: new CurrencyRecord({ gold: 2.25 }),
      model: null, // TODO: provide real model
    },
  ]),
  name: 'Windmill',
}
