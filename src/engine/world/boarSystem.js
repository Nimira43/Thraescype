const BOAR_TERRAIN = ['hill', 'forest']
const LIFESPAN_MS = 6000
const SPAWN_CHANCE = 0.06 
const MAX_BOARS = 3

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function findQualifyingTile(world, maxAttempts = 100) {
  for (let i = 0; i < maxAttempts; i++) {
    const y = Math.floor(Math.random() * world.grid.length)
    const x = Math.floor(Math.random() * world.grid[0].length)
    const cell = world.grid[y][x]

    if (!BOAR_TERRAIN.includes(cell.type)) continue
    if (cell.entity) continue

    return { x, y }
  }
  return null 
}

export function stepBoars(boars, worlds) {
  const alive = boars.filter(b => Date.now() - b.spawnedAt < LIFESPAN_MS)

  if (alive.length >= MAX_BOARS) return alive
  if (Math.random() >= SPAWN_CHANCE) return alive

  const world = worlds[Math.floor(Math.random() * worlds.length)]
  const tile = findQualifyingTile(world)
  if (!tile) return alive

  return [
    ...alive,
    {
      id: makeId(),
      worldId: world.id,
      x: tile.x,
      y: tile.y,
      spawnedAt: Date.now()
    }
  ]
}