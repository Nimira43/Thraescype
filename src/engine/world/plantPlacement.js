import { placeItem } from './worldGenerator'

function findHillTile(world, maxAttempts = 200) {
  for (let i = 0; i < maxAttempts; i++) {
    const y = Math.floor(Math.random() * world.grid.length)
    const x = Math.floor(Math.random() * world.grid[0].length)
    const cell = world.grid[y][x]

    if (cell.type !== 'hill') continue
    if (cell.entity) continue

    return { x, y }
  }
  return null
}

export function placeEverlastingPlant(worlds, maxWorldAttempts = 50) {
  for (let i = 0; i < maxWorldAttempts; i++) {
    const world = worlds[Math.floor(Math.random() * worlds.length)]
    const tile = findHillTile(world)

    if (tile) {
      placeItem(world, 'everlasting_plant', tile.x, tile.y)
      return
    }
  }
}
