// The Witch's Lair: an 8x8 structure stamped onto exactly one world at game
// creation. Mountains form the perimeter except a single one-cell gap
// (the entrance). The interior is a random mix of forest and swamp.

const LAIR_SIZE = 8

function pickInteriorTerrain() {
  return Math.random() < 0.5 ? 'forest' : 'swamp'
}

function isPerimeterCell(dx, dy) {
  return dx === 0 || dx === LAIR_SIZE - 1 || dy === 0 || dy === LAIR_SIZE - 1
}

function overlapsExisting(world, anchorX, anchorY) {
  const overlapsPortal = world.portals.some(p =>
    p.x >= anchorX && p.x < anchorX + LAIR_SIZE &&
    p.y >= anchorY && p.y < anchorY + LAIR_SIZE
  )
  if (overlapsPortal) return true

  for (let dx = 0; dx < LAIR_SIZE; dx++) {
    for (let dy = 0; dy < LAIR_SIZE; dy++) {
      const cell = world.grid[anchorY + dy]?.[anchorX + dx]
      if (cell?.entity) return true
    }
  }

  return false
}

export function placeWitchsLair(world, worldWidth, worldHeight, maxAttempts = 200) {
  let anchorX, anchorY
  let attempts = 0

  do {
    anchorX = Math.floor(Math.random() * (worldWidth - LAIR_SIZE))
    anchorY = Math.floor(Math.random() * (worldHeight - LAIR_SIZE))
    attempts++
  } while (overlapsExisting(world, anchorX, anchorY) && attempts < maxAttempts)

  if (attempts >= maxAttempts) return world // couldn't find a clean spot — leave world untouched

  // Pick one perimeter cell to act as the entrance gap
  const perimeterCells = []
  for (let dx = 0; dx < LAIR_SIZE; dx++) {
    for (let dy = 0; dy < LAIR_SIZE; dy++) {
      if (isPerimeterCell(dx, dy)) perimeterCells.push({ dx, dy })
    }
  }
  const gap = perimeterCells[Math.floor(Math.random() * perimeterCells.length)]

  for (let dx = 0; dx < LAIR_SIZE; dx++) {
    for (let dy = 0; dy < LAIR_SIZE; dy++) {
      const x = anchorX + dx
      const y = anchorY + dy
      const isGap = dx === gap.dx && dy === gap.dy

      const type = (isPerimeterCell(dx, dy) && !isGap)
        ? 'mountain'
        : pickInteriorTerrain()

      world.grid[y][x] = { ...world.grid[y][x], type }
    }
  }

  world.witchsLair = {
    x: anchorX,
    y: anchorY,
    size: LAIR_SIZE,
    entrance: { x: anchorX + gap.dx, y: anchorY + gap.dy }
  }

  return world
}