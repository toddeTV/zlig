import type { CurrencyRecord } from '@/game-logic/currencies.js'

export type LevelProgression = FixedLevelProgression

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
   * The costs to build/upgrade the building without taking into account any bonuses.
   */
  baseCosts: CurrencyRecord
  /**
   * The number of seconds it takes to build/upgrade the building without taking into account any bonuses.
   */
  baseBuildingSeconds: number
  /**
   * The currency the player receives each second.
   */
  baseIncomePerSecond: CurrencyRecord
}>

type FirstLevelFixedProgression = BaseLevelFixedProgression & Readonly<{

  /**
   * Defines the appearance of the building on the first level.
   */
  // TODO: Actually provide a real type here.
  model: any
}>

type LaterLevelsFixedProgression = BaseLevelFixedProgression & Readonly<{
  /**
   * Defines the appearance of the building on this level. If not given defaults to the appearance of the previous
   * level.
   */
  // TODO: Actually provide a real type here.
  model?: any
}>
