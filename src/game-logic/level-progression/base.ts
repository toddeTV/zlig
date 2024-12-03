import type { ResourceRecord, ResourcesPerMillisecond } from '@/game-logic/resources.js'
import type { BuildingModel } from '@/game-logic/types.js'
import type { Duration } from '@/utils/duration.js'

export abstract class LevelProgression {
  constructor(
    /**
     * Limits the maximum level of the building. `undefined` means the building can be upgraded endlessly.
     */
    readonly maxLevel: number | undefined,
  ) {}

  /**
   * @returns The costs to build/upgrade the building without taking into account any modifiers.
   */
  getBaseCostsForLevel(level: number) {
    this.validateLevel(level)

    return this.doGetBaseCostsForLevel(level)
  }

  /**
   * @returns The duration it takes to build/upgrade the building without taking into account any modifiers.
   */
  getBaseBuildingDurationForLevel(level: number) {
    this.validateLevel(level)

    return this.doGetBaseBuildingDurationForLevel(level)
  }

  /**
   * @returns The currency the player receives each millisecond without taking into account any modifiers.
   */
  getBaseIncomeForLevel(level: number) {
    this.validateLevel(level)

    return this.doGetBaseIncomeForLevel(level)
  }

  /**
   * Defines the appearance of the building on this level.
   */
  getModelForLevel(level: number) {
    this.validateLevel(level)

    return this.doGetModelForLevel(level)
  }

  protected abstract doGetBaseCostsForLevel(level: number): ResourceRecord
  protected abstract doGetBaseBuildingDurationForLevel(level: number): Duration
  protected abstract doGetBaseIncomeForLevel(level: number): ResourcesPerMillisecond
  protected abstract doGetModelForLevel(level: number): BuildingModel

  private validateLevel(level: number) {
    if (level < 1) {
      throw new Error('Each building needs at least one level')
    }
    else if (this.maxLevel && level > this.maxLevel) {
      throw new Error('This building does not have that much levels')
    }
  }
}
