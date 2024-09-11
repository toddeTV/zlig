import Big from 'big.js'
import BuildingA from '@/components/models/buildings/BuildingA.vue'
import BuildingB from '@/components/models/buildings/BuildingB.vue'
import { FixedLevelProgression, LinearLevelProgression } from '@/game-logic/buildings/level-progression.js'
import type { BuildingType } from '@/game-logic/buildings/types.js'
import { well } from '@/game-logic/buildings/well.js'
import { windmill } from '@/game-logic/buildings/windmill.js'
import { ResourceRecord } from '@/game-logic/resources.js'

const a: BuildingType = {
  levelProgression: new LinearLevelProgression({
    buildingSeconds: { additionalPerLevel: new Big('20'), initial: new Big('3') },
    costs: { additionalPerLevel: new ResourceRecord(), initial: new ResourceRecord({ gold: new Big('10') }) },
    getModel: () => BuildingA,
    income: { additionalPerLevel: new ResourceRecord({ gold: new Big('0.05') }), initial: new ResourceRecord({ gold: new Big('0.1') }) },
  }),
  maxInstances: 3,
  name: 'Building A',
}

const b: BuildingType = {
  levelProgression: new FixedLevelProgression([
    {
      baseBuildingSeconds: new Big('7'),
      baseCosts: new ResourceRecord({ gold: new Big('15') }),
      baseIncomePerSecond: new ResourceRecord({ gold: new Big('3') }),
      model: BuildingB,
    },
    {
      baseBuildingSeconds: new Big('10'),
      baseCosts: new ResourceRecord({ gold: new Big('20') }),
      baseIncomePerSecond: new ResourceRecord({ gold: new Big('5') }),
    },
    {
      baseBuildingSeconds: new Big('27'),
      baseCosts: new ResourceRecord({ gold: new Big('45') }),
      baseIncomePerSecond: new ResourceRecord({ gold: new Big('12') }),
    },
  ]),
  maxInstances: undefined,
  name: 'Building B',
}

export const buildingTypes = { a, b, well, windmill }
