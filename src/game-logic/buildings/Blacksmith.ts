import Blacksmith from '@/components/models/buildings/Blacksmith.vue'
import { LinearLevelProgression } from '@/game-logic/level-progression/linear-progression.js'
import { ResourceRecord, resourcesPerHour } from '@/game-logic/resources.js'
import { Duration } from '@/utils/duration.js'
import Big from 'big.js'
import type { BuildingType } from '@/game-logic/types.js'

const building: BuildingType = {
  description: 'A place where you can forge your weapons and armor - and repair your broken household stuff.',
  id: 'Blacksmith',
  levelProgression: new LinearLevelProgression({
    buildingDuration: {
      additionalPerLevel: Duration.fromHours(new Big('4')),
      initial: Duration.fromHours(new Big('15')),
    },
    costs: {
      additionalPerLevel: new ResourceRecord({ gold: new Big('60') }),
      initial: new ResourceRecord({ gold: new Big('60') }),
    },
    getModel: () => markRaw(Blacksmith),
    income: {
      additionalPerLevel: resourcesPerHour({ gold: new Big('0.35') }),
      initial: resourcesPerHour({ gold: new Big('0.7') }),
    },
    maxLevel: 5,
  }),
  maxInstances: 2,
  name: 'Blacksmith',
}

export default building
