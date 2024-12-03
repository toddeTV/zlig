import { LevelProgression } from '@/game-logic/level-progression/base.js'
import type { ResourceRecord, ResourcesPerMillisecond } from '@/game-logic/resources.js'
import type { BuildingModel } from '@/game-logic/types.js'
import type { Duration } from '@/utils/duration.js'

export class CalculatingLevelProgression extends LevelProgression {
  constructor({ costs, duration, income, maxLevel, model }: {
    costs: typeof LevelProgression.prototype['doGetBaseCostsForLevel']
    duration: typeof LevelProgression.prototype['doGetBaseBuildingDurationForLevel']
    income: typeof LevelProgression.prototype['doGetBaseIncomeForLevel']
    model: typeof LevelProgression.prototype['doGetModelForLevel']
    maxLevel?: number
  }) {
    super(maxLevel)

    this.doGetBaseCostsForLevel = costs
    this.doGetBaseBuildingDurationForLevel = duration
    this.doGetBaseIncomeForLevel = income
    this.doGetModelForLevel = model
  }

  protected doGetBaseCostsForLevel(_level: number): ResourceRecord {
    throw new Error('Method should be replaced by the constructor!')
  }

  protected doGetBaseBuildingDurationForLevel(_level: number): Duration {
    throw new Error('Method should be replaced by the constructor!')
  }

  protected doGetBaseIncomeForLevel(_level: number): ResourcesPerMillisecond {
    throw new Error('Method should be replaced by the constructor!')
  }

  protected doGetModelForLevel(_level: number): BuildingModel {
    throw new Error('Method should be replaced by the constructor!')
  }
}
