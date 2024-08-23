import type { CurrencyRecord } from '@/game-logic/currencies.js'

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
   * @returns The number of seconds it takes to build/upgrade the building without taking into account any modifiers.
   */
  getBaseBuildingSecondsForLevel(level: number) {
    this.validateLevel(level)

    return this.doGetBaseBuildingSecondsForLevel(level)
  }

  /**
   * @returns The currency the player receives each second without taking into account any modifiers.
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

  protected abstract doGetBaseCostsForLevel(level: number): CurrencyRecord
  protected abstract doGetBaseBuildingSecondsForLevel(level: number): number
  protected abstract doGetBaseIncomeForLevel(level: number): CurrencyRecord
  protected abstract doGetModelForLevel(level: number): any // TODO: Actually provide a real type here.

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

  protected doGetBaseBuildingSecondsForLevel(level: number) {
    return this.levels[level - 1].baseBuildingSeconds
  }

  protected doGetBaseIncomeForLevel(level: number) {
    return this.levels[level - 1].baseIncomePerSecond
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
  baseCosts: CurrencyRecord
  /**
   * The number of seconds it takes to build/upgrade the building without taking into account any modifiers.
   */
  baseBuildingSeconds: number
  /**
   * The currency the player receives each second without taking into account any modifiers.
   */
  baseIncomePerSecond: CurrencyRecord
}>

type FirstLevelFixedProgression = BaseLevelFixedProgression & Readonly<{

  /**
   * Defines the appearance of the building on the first level.
   */
  model: any // TODO: Actually provide a real type here.
}>

type LaterLevelsFixedProgression = BaseLevelFixedProgression & Readonly<{
  /**
   * Defines the appearance of the building on this level. If not given defaults to the appearance of the previous
   * level.
   */
  model?: any // TODO: Actually provide a real type here.
}>

/**
 * This type of building level progression calculates all values based on an initial value and additional values per
 * level.
 */
export class LinearLevelProgression extends LevelProgression {
  private costs: {
    initial: CurrencyRecord
    additionalPerLevel: CurrencyRecord
  }

  private buildingSeconds: {
    initial: number
    additionalPerLevel: number
  }

  private income: {
    initial: CurrencyRecord
    additionalPerLevel: CurrencyRecord
  }

  constructor({ buildingSeconds, costs, getModel, income, maxLevel }: {
    costs: {
      initial: CurrencyRecord
      additionalPerLevel: CurrencyRecord
    }
    buildingSeconds: {
      initial: number
      additionalPerLevel: number
    }
    income: {
      initial: CurrencyRecord
      additionalPerLevel: CurrencyRecord
    }
    getModel: (level: number) => any // TODO: Actually provide a real type here.
    maxLevel?: number
  }) {
    super(maxLevel)

    this.costs = costs
    this.buildingSeconds = buildingSeconds
    this.income = income
    this.doGetModelForLevel = getModel
  }

  protected doGetBaseCostsForLevel(level: number): CurrencyRecord {
    return this.costs.initial.plus(this.costs.additionalPerLevel.times(level))
  }

  protected doGetBaseBuildingSecondsForLevel(level: number): number {
    return this.buildingSeconds.initial + this.buildingSeconds.additionalPerLevel * level
  }

  protected doGetBaseIncomeForLevel(level: number): CurrencyRecord {
    return this.income.initial.plus(this.income.additionalPerLevel.times(level))
  }

  protected doGetModelForLevel(_level: number) {
    throw new Error('This function should be replaced in the constructor')
  }
}
