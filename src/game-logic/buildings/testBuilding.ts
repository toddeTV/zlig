import TestBuilding from '@/components/models/buildings/TestBuilding.vue'
import { LinearLevelProgression } from '@/game-logic/level-progression.js'
import { ResourceRecord, resourcesPerHour } from '@/game-logic/resources.js'
import Big from 'big.js'
import { markRaw } from 'vue'
import type { BuildingType } from '@/game-logic/types.js'

const building: BuildingType = {
  id: 'testBuilding',
  levelProgression: new LinearLevelProgression({
    buildingMilliseconds: {
      additionalPerLevel: new Big('2').times(60).times(60).times(1000), // game time hours
      initial: new Big('5').times(60).times(60).times(1000), // game time hours
    },
    costs: {
      additionalPerLevel: new ResourceRecord(),
      initial: new ResourceRecord({ gold: new Big('10') }),
    },
    getModel: () => markRaw(TestBuilding),
    income: {
      additionalPerLevel: resourcesPerHour({ gold: new Big('0.2') }),
      initial: resourcesPerHour({ gold: new Big('0.5') }),
    },
  }),
  maxInstances: 4,
  name: 'Test Building',
}

export default building
