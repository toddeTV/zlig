import { type ResourceRecord, ResourcesPerMillisecond } from '@/game-logic/resources.js'
import type { BuildingModel } from '@/game-logic/types.js'
import type Big from 'big.js'

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
   * @returns The number of game time milliseconds it takes to build/upgrade the building without taking into account any modifiers.
   */
  getBaseBuildingMillisecondsForLevel(level: number) {
    this.validateLevel(level)

    return this.doGetBaseBuildingMillisecondsForLevel(level)
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
  protected abstract doGetBaseBuildingMillisecondsForLevel(level: number): Big
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

/**
 * This type of building level progression has fixed values defined for each level. Only those defined levels are
 * available in the game.
 */
export class FixedLevelProgression extends LevelProgression {
  constructor(private levels: [FirstLevelFixedProgression, ...LaterLevelsFixedProgression[]]) {
    // The first entry with index 0 is for level 1.
    super(levels.length)
  }

  protected doGetBaseCostsForLevel(level: number) {
    return this.levels[level - 1].baseCosts
  }

  protected doGetBaseBuildingMillisecondsForLevel(level: number) {
    return this.levels[level - 1].baseBuildingMilliseconds
  }

  protected doGetBaseIncomeForLevel(level: number) {
    return this.levels[level - 1].baseIncome
  }

  protected doGetModelForLevel(level: number) {
    // Try to find a model from the requested level downwards.
    for (;level > 1; level--) {
      const model = this.levels[level]?.model
      if (model !== undefined) {
        return model
      }
    }

    // As a fallback use the base model
    return this.levels[0].model
  }
}

type BaseLevelFixedProgression = Readonly<{
  /**
   * The costs to build/upgrade the building without taking into account any modifiers.
   */
  baseCosts: ResourceRecord

  /**
   * The number of game time milliseconds it takes to build/upgrade the building without taking into account any modifiers.
   */
  baseBuildingMilliseconds: Big

  /**
   * The currency the player receives each game time millisecond without taking into account any modifiers.
   */
  baseIncome: ResourcesPerMillisecond
}>

type FirstLevelFixedProgression = BaseLevelFixedProgression & Readonly<{
  /**
   * Defines the appearance of the building on the first level.
   */
  model: BuildingModel
}>

type LaterLevelsFixedProgression = BaseLevelFixedProgression & Readonly<{
  /**
   * Defines the appearance of the building on this level. If not given defaults to the appearance of the previous
   * level.
   */
  model?: BuildingModel
}>

/**
 * This type of building level progression calculates all values based on an initial value and additional values per
 * level.
 */
export class LinearLevelProgression extends LevelProgression {
  private costs: {
    initial: ResourceRecord
    additionalPerLevel: ResourceRecord
  }

  private buildingMilliseconds: {
    initial: Big
    additionalPerLevel: Big
  }

  private income: {
    initial: ResourceRecord
    additionalPerLevel: ResourceRecord
  }

  constructor({ buildingMilliseconds, costs, getModel, income, maxLevel }: {
    costs: {
      initial: ResourceRecord
      additionalPerLevel: ResourceRecord
    }
    buildingMilliseconds: {
      initial: Big
      additionalPerLevel: Big
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
    this.buildingMilliseconds = buildingMilliseconds
    this.income = income
    this.doGetModelForLevel = getModel
  }

  protected doGetBaseCostsForLevel(level: number): ResourceRecord {
    return this.costs.initial.plus(this.costs.additionalPerLevel.times(level))
  }

  protected doGetBaseBuildingMillisecondsForLevel(level: number): Big {
    return this.buildingMilliseconds.initial.plus(this.buildingMilliseconds.additionalPerLevel.times(level - 1))
  }

  protected doGetBaseIncomeForLevel(level: number) {
    return new ResourcesPerMillisecond(this.income.initial.plus(this.income.additionalPerLevel.times(level - 1)))
  }

  protected doGetModelForLevel(_level: number): BuildingModel {
    throw new Error('This function should be replaced in the constructor')
  }
}
