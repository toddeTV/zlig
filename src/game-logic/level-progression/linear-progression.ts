import { CalculatingLevelProgression } from '@/game-logic/level-progression/calculating-progression.js'
import { type ResourceRecord, ResourcesPerMillisecond } from '@/game-logic/resources.js'
import type { BuildingModel } from '@/game-logic/types.js'
import type { Duration } from '@/utils/duration.js'

/**
 * This type of building level progression calculates all values based on an initial value and additional values per
 * level.
 */
export class LinearLevelProgression extends CalculatingLevelProgression {
  constructor({ buildingDuration: buildingMilliseconds, costs, getModel, income, maxLevel }: {
    costs: {
      initial: ResourceRecord
      additionalPerLevel: ResourceRecord
    }
    buildingDuration: {
      initial: Duration
      additionalPerLevel: Duration
    }
    income: {
      initial: ResourcesPerMillisecond
      additionalPerLevel: ResourcesPerMillisecond
    }
    getModel: (level: number) => BuildingModel
    maxLevel?: number
  }) {
    super({
      costs(level) {
        if (level === 1) {
          return costs.initial
        }

        return costs.additionalPerLevel.times(level - 1)
      },

      duration(level) {
        if (level === 1) {
          return buildingMilliseconds.initial
        }

        return buildingMilliseconds.additionalPerLevel.times(level - 1)
      },

      income(level) {
        return new ResourcesPerMillisecond(income.initial.plus(income.additionalPerLevel.times(level - 1)))
      },

      maxLevel,

      model: getModel,
    })
  }
}
