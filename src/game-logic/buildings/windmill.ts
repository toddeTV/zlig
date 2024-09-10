import Big from 'big.js'
import { FixedLevelProgression } from '@/game-logic/buildings/level-progression.js'
import type { BuildingType } from '@/game-logic/buildings/types.js'
import { ResourceRecord } from '@/game-logic/resources.js'

export const windmill: BuildingType = {
  levelProgression: new FixedLevelProgression([
    {
      baseBuildingSeconds: 5.5,
      baseCosts: new ResourceRecord({ gold: new Big('15') }),
      baseIncomePerSecond: new ResourceRecord({ gold: new Big('1') }),
      model: null, // TODO: provide real model
    },
    {
      baseBuildingSeconds: 4,
      baseCosts: new ResourceRecord({ gold: new Big('7') }),
      baseIncomePerSecond: new ResourceRecord({ gold: new Big('1.5') }),
    },
    {
      baseBuildingSeconds: 7,
      baseCosts: new ResourceRecord({ gold: new Big('12') }),
      baseIncomePerSecond: new ResourceRecord({ gold: new Big('2.25') }),
      model: null, // TODO: provide real model
    },
  ]),
  maxInstances: undefined,
  name: 'Windmill',
}