import type { LevelProgression } from '@/game-logic/building-classes/level-progression.js'

export type BuildingClass = Readonly<{
  /**
   * The display name of the building type.
   */
  name: string
  /**
   * Determines the available building levels with costs and benefits.
   */
  levelProgression: LevelProgression
  /**
   * Determines the maximum allowed buildings to place of this class.
   */
  maxInstances: number | undefined

  // TODO: Maybe restrict the available building places by some criteria?
  // available_building_places: 'shore'
}>
