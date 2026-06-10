import { NPCS } from './npcData'
import { ITEMS } from './items'

export function createNPC(id) {
  if (!NPCS[id]) {
    console.warn(`NPC '${id}' not found in NPCS data`)
    return null
  }

  return {
    kind: 'npc',
    id,
    name: NPCS[id].name,
    dialogue: NPCS[id].dialogue,
    questId: NPCS[id].questId || null
  }
}

export function createItem(id) {
  if (!ITEMS[id]) {
    console.warn(`Item '${id}' not found in ITEMS data`)
    return null
  }

  return {
    kind: 'item',
    id,
    name: ITEMS[id].name,
    description: ITEMS[id].description
  }
}
