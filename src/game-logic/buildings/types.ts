import type { LevelProgression } from '@/game-logic/buildings/level-progression.js'
import type { ResourceRecord } from '@/game-logic/resources.js'

export type BuildingType = Readonly<{
  /**
   * The display name of the building type.
   */
  name: string
  /**
   * Determines the available building levels with costs and benefits.
   */
  levelProgression: LevelProgression
  /**
   * Determines the maximum allowed buildings to place of this type.
   */
  maxInstances: number | undefined

  // TODO: Maybe restrict the available building places by some criteria?
  // available_building_places: 'shore'
}>

// TODO: Make this more type safe.
export type BuildingLotId = string

export type BuildingInstance = {
  /**
   * A reference to the type of the building.
   */
  type: BuildingType
} & BuildingState

export type BuildingState = BuildingStateInConstruction | BuildingStateUpgrading | BuildingStateProducing

/**
 * The state for buildings that are in the process of being built right now.
 *
 * Next possible states: 'producing'
 */
export type BuildingStateInConstruction = Readonly<{
  state: 'in-construction'
  /**
   * The seconds left when the building will be finished and reach level 1.
   */
  secondsRemaining: Big
}>

/**
 * The state for buildings that are in the process of being upgraded right now.
 *
 * Next possible states: 'producing'
 */
export type BuildingStateUpgrading = Readonly<{
  state: 'upgrading'
  /**
   * The level of the building before upgrading started.
   */
  currentLevel: number
  /**
   * The seconds left when the building will reach the next level.
   */
  secondsRemaining: Big
}>

/**
 * The 'idle' state of buildings. Here they may produce resources based on the time passed.
 */
export type BuildingStateProducing = Readonly<{
  state: 'producing'
  /**
   * The current level of the building.
   */
  level: number
  /**
   * The internal buffer to handle fractional produced resources.
   */
  internalBuffer: ResourceRecord
}>
