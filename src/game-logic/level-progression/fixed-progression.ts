import { LevelProgression } from '@/game-logic/level-progression/base.js'
import type { ResourceRecord, ResourcesPerMillisecond } from '@/game-logic/resources.js'
import type { BuildingModel } from '@/game-logic/types.js'
import type { Duration } from '@/utils/duration.js'

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

  protected doGetBaseBuildingDurationForLevel(level: number) {
    return this.levels[level - 1].baseBuildingDuration
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
     * The duration it takes to build/upgrade the building without taking into account any modifiers.
     */
    baseBuildingDuration: Duration

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
