import Lumbermill from '@/components/models/buildings/Lumbermill.vue'
import { LinearLevelProgression } from '@/game-logic/level-progression/linear-progression.js'
import { ResourceRecord, resourcesPerHour } from '@/game-logic/resources.js'
import { Duration } from '@/utils/duration.js'
import Big from 'big.js'
import type { BuildingType } from '@/game-logic/types.js'

const building: BuildingType = {
  description: 'A place where you can cut down trees and produce wood.',
  id: 'Lumbermill',
  levelProgression: new LinearLevelProgression({
    buildingDuration: {
      additionalPerLevel: Duration.fromHours(new Big('1.5')),
      initial: Duration.fromHours(new Big('12')),
    },
    costs: {
      additionalPerLevel: new ResourceRecord({ gold: new Big('20') }),
      initial: new ResourceRecord({ gold: new Big('90') }),
    },
    getModel: () => markRaw(Lumbermill),
    income: {
      additionalPerLevel: resourcesPerHour({ gold: new Big('0.15') }),
      initial: resourcesPerHour({ gold: new Big('0.8') }),
    },
    maxLevel: 10,
  }),
  maxInstances: 3,
  name: 'Lumbermill',
}

export default building
