import { placeNPC, placeItem } from './worldGenerator'

const AVOID_TERRAIN = ['water', 'deepwater', 'portal', 'mountain']

function findQualifyingTile(world, maxAttempts = 100) {
  for (let i = 0; i < maxAttempts; i++) {
    const y = Math.floor(Math.random() * world.grid.length)
    const x = Math.floor(Math.random() * world.grid[0].length)
    const cell = world.grid[y][x]

    if (AVOID_TERRAIN.includes(cell.type)) continue
    if (cell.entity) continue

    return { x, y }
  }
  return null
}

export function placeEadricQuest(worlds) {
  const eadricWorld = worlds[Math.floor(Math.random() * worlds.length)]
  const eadricTile = findQualifyingTile(eadricWorld)
  if (eadricTile) {
    placeNPC(eadricWorld, 'old_man_1', eadricTile.x, eadricTile.y)
  }

  const heirlooms = ['lost_relic', 'eadric_locket', 'eadric_pipe']

  heirlooms.forEach(itemId => {
    const world = worlds[Math.floor(Math.random() * worlds.length)]
    const tile = findQualifyingTile(world)
    if (tile) {
      placeItem(world, itemId, tile.x, tile.y)
    }
  })
}
