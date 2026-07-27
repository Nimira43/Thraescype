// The wild boar: a scarce, huntable creature native to hill and forest
// tiles. Same rhythm as the Cloud (appears, lingers briefly, vanishes,
// reappears elsewhere) but instead of drifting, it's a fixed point the
// player can walk up to and hunt for meat.
//
// Deliberately single-instance for now, same as the Cloud — scaling to
// several boars roaming at once later would mean tracking an array of
// these instead of one, but the spawn/lifespan logic itself wouldn't need
// to change.

const BOAR_TERRAIN = ['hill', 'forest']
const LIFESPAN_MS = 6000 // how long it lingers before fleeing back into hiding
const SPAWN_CHANCE = 0.05 // per tick, only rolled while no boar is currently active

function findQualifyingTile(world, maxAttempts = 100) {
  for (let i = 0; i < maxAttempts; i++) {
    const y = Math.floor(Math.random() * world.grid.length)
    const x = Math.floor(Math.random() * world.grid[0].length)
    const cell = world.grid[y][x]

    if (!BOAR_TERRAIN.includes(cell.type)) continue
    if (cell.entity) continue

    return { x, y }
  }
  return null // no qualifying tile found this attempt — just try again next tick
}

// One tick of boar behaviour. `worlds` is the live worlds array so a fresh
// spawn always reflects current terrain/entities, not a stale snapshot.
export function stepBoar(boar, worlds) {
  if (boar) {
    const age = Date.now() - boar.spawnedAt
    return age >= LIFESPAN_MS ? null : boar // flee once its time is up, otherwise unchanged
  }

  if (Math.random() >= SPAWN_CHANCE) return null // stays absent this tick

  const world = worlds[Math.floor(Math.random() * worlds.length)]
  const tile = findQualifyingTile(world)
  if (!tile) return null

  return {
    worldId: world.id,
    x: tile.x,
    y: tile.y,
    spawnedAt: Date.now()
  }
}