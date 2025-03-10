import Well from '@/components/models/buildings/Well.vue'
import { LinearLevelProgression } from '@/game-logic/level-progression/linear-progression.js'
import { ResourceRecord, resourcesPerHour } from '@/game-logic/resources.js'
import { Duration } from '@/utils/duration.js'
import Big from 'big.js'
import { markRaw } from 'vue'
import type { BuildingType } from '@/game-logic/types.js'

const building: BuildingType = {
  description: 'A place where you can get water.',
  id: 'Well',
  levelProgression: new LinearLevelProgression({
    buildingDuration: {
      additionalPerLevel: Duration.fromHours(new Big('2.5')),
      initial: Duration.fromHours(new Big('10')),
    },
    costs: {
      additionalPerLevel: new ResourceRecord({ gold: new Big('20') }),
      initial: new ResourceRecord({ gold: new Big('60') }),
    },
    getModel: () => markRaw(Well),
    income: {
      additionalPerLevel: resourcesPerHour({ gold: new Big('0.2') }),
      initial: resourcesPerHour({ gold: new Big('0.55') }),
    },
  }),
  maxInstances: 7,
  name: 'Well',
}

export default building
