import Market from '@/components/models/buildings/Market.vue'
import { LinearLevelProgression } from '@/game-logic/level-progression/linear-progression.js'
import { ResourceRecord, resourcesPerHour } from '@/game-logic/resources.js'
import { Duration } from '@/utils/duration.js'
import Big from 'big.js'
import type { BuildingType } from '@/game-logic/types.js'

const building: BuildingType = {
  description: 'A place where you can buy and sell goods.',
  id: 'Market',
  levelProgression: new LinearLevelProgression({
    buildingDuration: {
      additionalPerLevel: Duration.fromHours(new Big('1')),
      initial: Duration.fromHours(new Big('4')),
    },
    costs: {
      additionalPerLevel: new ResourceRecord({ gold: new Big('15') }),
      initial: new ResourceRecord({ gold: new Big('50') }),
    },
    getModel: () => markRaw(Market),
    income: {
      additionalPerLevel: resourcesPerHour({ gold: new Big('0.15') }),
      initial: resourcesPerHour({ gold: new Big('0.35') }),
    },
    maxLevel: 7,
  }),
  maxInstances: 1,
  name: 'Market',
}

export default building
