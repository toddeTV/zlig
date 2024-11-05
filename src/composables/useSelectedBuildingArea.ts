import { defineStore } from 'pinia'
import type { BuildingAreaId } from '@/game-logic/types.js'

export default defineStore('selectedBuilding', () => ({ id: null as BuildingAreaId | null }))
