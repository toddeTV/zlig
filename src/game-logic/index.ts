import { gameEvents } from '@/game-logic/events/index.js'

export function startGameLoop() {
  let raf = requestAnimationFrame(emitTick)

  let lastDt: DOMHighResTimeStamp = 0

  function emitTick(dt: DOMHighResTimeStamp) {
    // We don't get the delta but the time passed since (probably) the page load.
    const delta = dt - lastDt
    lastDt = dt

    gameEvents.emit('game_tick', delta)

    raf = requestAnimationFrame(emitTick)
  }

  return () => cancelAnimationFrame(raf)
}
