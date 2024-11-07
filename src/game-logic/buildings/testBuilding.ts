import TestBuilding from '@/components/models/buildings/TestBuilding.vue'
import { LinearLevelProgression } from '@/game-logic/level-progression.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import Big from 'big.js'
import { markRaw } from 'vue'
import type { BuildingType } from '@/game-logic/types.js'

const building: BuildingType = {
  id: 'testBuilding',
  levelProgression: new LinearLevelProgression({
    buildingSeconds: {
      additionalPerLevel: new Big('2'),
      initial: new Big('5'),
    },
    costs: {
      additionalPerLevel: new ResourceRecord(),
      initial: new ResourceRecord({ gold: new Big('10') }),
    },
    getModel: () => markRaw(TestBuilding),
    income: {
      additionalPerLevel: new ResourceRecord({ gold: new Big('0.05') }),
      initial: new ResourceRecord({ gold: new Big('0.1') }),
    },
  }),
  maxInstances: 4,
  name: 'Test Building',
}

export default building