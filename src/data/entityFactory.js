import { NPCS } from './npcData'
import { ITEMS } from './items'

export function createNPC(id) {
  const def = NPCS[id]
  if (!def) return null

  return {
    kind: 'npc',
    id,
    name: def.name,
    dialogueTreeId: def.dialogueTreeId || null
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
