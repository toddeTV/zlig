import Tavern from '@/components/models/buildings/Tavern.vue'
import { LinearLevelProgression } from '@/game-logic/level-progression/linear-progression.js'
import { ResourceRecord, resourcesPerHour } from '@/game-logic/resources.js'
import { Duration } from '@/utils/duration.js'
import Big from 'big.js'
import { markRaw } from 'vue'
import type { BuildingType } from '@/game-logic/types.js'

const building: BuildingType = {
  description: 'A place where you can drink and eat. And sometimes even sleep.',
  id: 'Tavern',
  levelProgression: new LinearLevelProgression({
    buildingDuration: {
      additionalPerLevel: Duration.fromHours(new Big('2.5')),
      initial: Duration.fromHours(new Big('10')),
    },
    costs: {
      additionalPerLevel: new ResourceRecord({ gold: new Big('20') }),
      initial: new ResourceRecord({ gold: new Big('60') }),
    },
    getModel: () => markRaw(Tavern),
    income: {
      additionalPerLevel: resourcesPerHour({ gold: new Big('0.15') }),
      initial: resourcesPerHour({ gold: new Big('0.6') }),
    },
    maxLevel: 3,
  }),
  maxInstances: 1,
  name: 'Tavern',
}

export default building
