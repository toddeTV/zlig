import HomeA from '@/components/models/buildings/HomeA.vue'
import { LinearLevelProgression } from '@/game-logic/level-progression/linear-progression.js'
import { ResourceRecord, resourcesPerHour } from '@/game-logic/resources.js'
import { Duration } from '@/utils/duration.js'
import Big from 'big.js'
import type { BuildingType } from '@/game-logic/types.js'

const building: BuildingType = {
  description: 'A house for your citizens to live in.',
  id: 'HomeA',
  levelProgression: new LinearLevelProgression({
    buildingDuration: {
      additionalPerLevel: Duration.fromHours(new Big('1.5')),
      initial: Duration.fromHours(new Big('5')),
    },
    costs: {
      additionalPerLevel: new ResourceRecord({ gold: new Big('25') }),
      initial: new ResourceRecord({ gold: new Big('20') }),
    },
    getModel: () => markRaw(HomeA),
    income: {
      additionalPerLevel: resourcesPerHour({ gold: new Big('0.05') }),
      initial: resourcesPerHour({ gold: new Big('0.2') }),
    },
    maxLevel: 4,
  }),
  maxInstances: undefined,
  name: 'Home A',
}

export default building
