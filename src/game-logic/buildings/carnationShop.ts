import CarnationShop from '@/components/models/buildings/CarnationShop.vue'
import { LinearLevelProgression } from '@/game-logic/level-progression.js'
import { ResourceRecord, resourcesPerHour } from '@/game-logic/resources.js'
import { Duration } from '@/utils/duration.js'
import Big from 'big.js'
import { markRaw } from 'vue'
import type { BuildingType } from '@/game-logic/types.js'

const building: BuildingType = {
  id: 'carnationShop',
  levelProgression: new LinearLevelProgression({
    buildingDuration: {
      additionalPerLevel: Duration.fromHours(new Big('10')),
      initial: Duration.fromHours(new Big('5')),
    },
    costs: {
      additionalPerLevel: new ResourceRecord({ gold: new Big('20') }),
      initial: new ResourceRecord({ gold: new Big('60') }),
    },
    getModel: () => markRaw(CarnationShop),
    income: {
      additionalPerLevel: resourcesPerHour({ gold: new Big('0.2') }),
      initial: resourcesPerHour({ gold: new Big('0.4') }),
    },
  }),
  maxInstances: 4,
  name: 'Carnation Shop',
}

export default building
