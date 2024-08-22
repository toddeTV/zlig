import type { CurrencyRecord } from '@/game-logic/currencies.js'

export type LevelProgression = FixedLevelProgression | CalculatedLevelProgression

/**
 * This type of building level progression has fixed values defined for each level. Only those defined levels are
 * available in the game.
 */
export type FixedLevelProgression = Readonly<{
  type: 'fixed'
  levels: [FirstLevelFixedProgression, ...LaterLevelsFixedProgression[]]
}>

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

export abstract class CalculatedLevelProgression {
  readonly type = 'calculated'
  /**
   * Limits the maximum level of the building. `undefined` means the building can be upgraded endlessly.
   */
  readonly maxLevel: number | undefined

  // TODO: What about the model?

  constructor(maxLevel?: number) {
    this.maxLevel = maxLevel
  }

  /**
   * @returns The costs to build/upgrade the building without taking into account any modifiers.
   */
  getBaseCostsForLevel(level: number) {
    this.validateLevel(level)

    return this.calculateBaseCostsForLevel(level)
  }

  /**
   * @returns The number of seconds it takes to build/upgrade the building without taking into account any modifiers.
   */
  getBaseBuildingSecondsForLevel(level: number) {
    this.validateLevel(level)

    return this.calculateBaseBuildingSecondsForLevel(level)
  }

  /**
   * @returns The currency the player receives each second without taking into account any modifiers.
   */
  getBaseIncomeForLevel(level: number) {
    this.validateLevel(level)

    return this.calculateBaseIncomeForLevel(level)
  }

  /**
   * Defines the appearance of the building on this level.
   */
  getModelForLevel(level: number) {
    this.validateLevel(level)

    return this.actuallyGetModelForLevel(level)
  }

  protected abstract calculateBaseCostsForLevel(level: number): CurrencyRecord
  protected abstract calculateBaseBuildingSecondsForLevel(level: number): number
  protected abstract calculateBaseIncomeForLevel(level: number): CurrencyRecord
  protected abstract actuallyGetModelForLevel(level: number): any // TODO: Actually provide a real type here.

  private validateLevel(level: number) {
    if (this.maxLevel && level > this.maxLevel) {
      throw new Error('This building does not have that much levels')
    }
  }
}

export class LinearLevelProgression extends CalculatedLevelProgression {
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
    this.actuallyGetModelForLevel = getModel
  }

  protected calculateBaseCostsForLevel(level: number): CurrencyRecord {
    return this.costs.initial.plus(this.costs.additionalPerLevel.times(level))
  }

  protected calculateBaseBuildingSecondsForLevel(level: number): number {
    return this.buildingSeconds.initial + this.buildingSeconds.additionalPerLevel * level
  }

  protected calculateBaseIncomeForLevel(level: number): CurrencyRecord {
    return this.income.initial.plus(this.income.additionalPerLevel.times(level))
  }

  protected actuallyGetModelForLevel(_level: number) {
    // This is replaced in the constructor
  }
}
