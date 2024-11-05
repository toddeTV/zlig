import { defineStore } from 'pinia'
import type { BuildingLotId } from '@/game-logic/types.js'

export default defineStore('selectedBuilding', () => ({ id: null as BuildingLotId | null }))
