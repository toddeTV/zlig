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
      additionalPerLevel: Duration.fromHours(new Big('48')),
      initial: Duration.fromHours(new Big('24')),
    },
    costs: {
      additionalPerLevel: new ResourceRecord(),
      initial: new ResourceRecord({ gold: new Big('1000') }),
    },
    getModel: () => markRaw(Windmill),
    income: {
      additionalPerLevel: resourcesPerHour({ gold: new Big('0.3') }),
      initial: resourcesPerHour({ gold: new Big('1.5') }),
    },
  }),
  maxInstances: 2,
  name: 'Windmill',
}

export default building