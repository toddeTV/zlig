import type { LevelProgression } from '@/game-logic/level-progression/base.js'
import type { ResourceRecord } from '@/game-logic/resources.js'
import type { Duration } from '@/utils/duration.js'
import type { Component } from 'vue'

export type BuildingType = Readonly<{
  /**
   * An internal identifier.
   */
  id: string

  /**
   * The display name of the building type.
   */
  name: string

  /**
   * A description displayed for each building.
   */
  description: string

  /**
   * Determines the available building levels with costs and benefits.
   */
  levelProgression: LevelProgression

  /**
   * Determines the maximum allowed buildings to place of this type.
   */
  maxInstances: number | undefined

  // TODO: Maybe restrict the available building places by some criteria?
  // availableBuildAreas: 'shore'
}>

// TODO: Make this more type safe.
export type BuildingAreaId = string

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
  level: 0

  /**
   * The duration left when the building will be finished and reach level 1.
   */
  durationRemaining: Duration

  /**
   * The total duration it takes to construct this building.
   */
  initialDuration: Duration
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
  level: number

  /**
   * The duration left when the building will reach the next level.
   */
  durationRemaining: Duration

  /**
   * The total duration it takes to upgrade this building.
   */
  initialDuration: Duration
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

export type BuildingModel = Component<{
  buildingInstance: BuildingInstance
}>
