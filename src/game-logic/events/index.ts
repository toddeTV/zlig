import { EventEmitter } from 'eventemitter3'

interface EventsMap {
  game_tick: [delta_ms: number]
}

export const gameEvents = new EventEmitter<EventsMap>()
