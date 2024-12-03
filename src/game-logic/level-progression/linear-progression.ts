import { LevelProgression } from '@/game-logic/level-progression/base.js'
import { type ResourceRecord, ResourcesPerMillisecond } from '@/game-logic/resources.js'
import type { BuildingModel } from '@/game-logic/types.js'
import type { Duration } from '@/utils/duration.js'

/**
 * This type of building level progression calculates all values based on an initial value and additional values per
 * level.
 */
export class LinearLevelProgression extends LevelProgression {
  private costs: {
    initial: ResourceRecord
    additionalPerLevel: ResourceRecord
  }

  private buildingDuration: {
    initial: Duration
    additionalPerLevel: Duration
  }

  private income: {
    initial: ResourceRecord
    additionalPerLevel: ResourceRecord
  }

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
      initial: ResourceRecord
      additionalPerLevel: ResourceRecord
    }
    getModel: (level: number) => BuildingModel
    maxLevel?: number
  }) {
    super(maxLevel)

    this.costs = costs
    this.buildingDuration = buildingMilliseconds
    this.income = income
    this.doGetModelForLevel = getModel
  }

  protected doGetBaseCostsForLevel(level: number): ResourceRecord {
    return this.costs.initial.plus(this.costs.additionalPerLevel.times(level - 1))
  }

  protected doGetBaseBuildingDurationForLevel(level: number): Duration {
    return this.buildingDuration.initial.plus(this.buildingDuration.additionalPerLevel.times(level - 1))
  }

  protected doGetBaseIncomeForLevel(level: number) {
    return new ResourcesPerMillisecond(this.income.initial.plus(this.income.additionalPerLevel.times(level - 1)))
  }

  protected doGetModelForLevel(_level: number): BuildingModel {
    throw new Error('This function should be replaced in the constructor')
  }
}
