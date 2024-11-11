import Windmill from '@/components/models/buildings/Windmill.vue'
import { LinearLevelProgression } from '@/game-logic/level-progression.js'
import { ResourceRecord, resourcesPerHour } from '@/game-logic/resources.js'
import { Duration } from '@/utils/duration.js'
import Big from 'big.js'
import { markRaw } from 'vue'
import type { BuildingType } from '@/game-logic/types.js'

const building: BuildingType = {
  id: 'windmill',
  levelProgression: new LinearLevelProgression({
    buildingDuration: {
      additionalPerLevel: Duration.fromHours(new Big('2')),
      initial: Duration.fromHours(new Big('5')),
    },
    costs: {
      additionalPerLevel: new ResourceRecord(),
      initial: new ResourceRecord({ gold: new Big('10') }),
    },
    getModel: () => markRaw(Windmill),
    income: {
      additionalPerLevel: resourcesPerHour({ gold: new Big('0.2') }),
      initial: resourcesPerHour({ gold: new Big('0.5') }),
    },
  }),
  maxInstances: 4,
  name: 'Windmill',
}

export default building
