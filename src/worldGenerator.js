const WIDTH = 60
const HEIGHT = 40

const PLAINS = 'plains'

function createGrid(fn) {
  const grid = []
  for (let y = 0; y < HEIGHT; y++) {
    const row = []
    for (let x = 0; x < WIDTH; x++) {
      row.push(fn ? fn(x, y) : 0)
    }
    grid.push(row)
  }
  return grid
}

function inBounds(x, y) {
  return (
    x >= 0 &&
    x < WIDTH &&
    y >= 0 &&
    y < HEIGHT
  )
}

function smoothField(field, passes = 1) {
  for (let p = 0; p < passes; p++) {
    const next = createGrid()
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        let sum = 0
        let count = 0
        for (let yy = -1; yy <= 1; yy++) {
          for (let xx = -1; xx <= 1; xx++) {
            const nx = x + xx
            const ny = y + yy
            if (inBounds(nx, ny)) {
              sum += field[ny][nx]
              count++
            }
          }
        }
        next[y][x] = sum / count
      }
    }
    field = next
  }
  return field
}

function randomField() {
  return createGrid(() => Math.random())
}

function carveRivers(elevation, terrain, riverCount = 4) {
  for (let i = 0; i < riverCount; i++) {
    let sx = Math.floor(Math.random() * WIDTH)
    let sy = Math.floor(Math.random() * HEIGHT)
    let bestH = 0

    for (let tries = 0; tries < 50; tries++) {
      const x = Math.floor(Math.random() * WIDTH)
      const y = Math.floor(Math.random() * HEIGHT)
      if (elevation[y][x] > bestH) {
        bestH = elevation[y][x]
        sx = x
        sy = y
      }
    }

    let x = sx
    let y = sy

    for (let steps = 0; steps < 200; steps++) {
      terrain[y][x] = 'water'

      let bestNx = x
      let bestNy = y
      let best = elevation[y][x]

      for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
          const nx = x + xx
          const ny = y + yy
          if (!inBounds(nx, ny)) continue
          const h = elevation[ny][nx]
          if (h < best) {
            best = h
            bestNx = nx
            bestNy = ny
          }
        }
      }

      if (bestNx === x && bestNy === y) break
      x = bestNx
      y = bestNy
    }
  }
}

export function generateWorld(worldId, portalTargets) {
  let elevation = randomField()
  elevation = smoothField(elevation, 4)

  let moisture = randomField()
  moisture = smoothField(moisture, 3)

  const terrain = createGrid()

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const h = elevation[y][x]
      const m = moisture[y][x]

      let t = PLAINS

      if (h < 0.25) t = 'water'
      
      else if (h < 0.3 && m > 0.5) t = 'swamp'
      else if (h > 0.8) t = 'mountain'
      else if (h > 0.65) t = 'rock'
      else if (m > 0.6) t = 'forest'
      else t = PLAINS

      terrain[y][x] = t
    }
  }

  carveRivers(elevation, terrain, 4)

  const portals = portalTargets.map((targetId, idx) => {
    let x, y
    do {
      x = Math.floor(Math.random() * WIDTH)
      y = Math.floor(Math.random() * HEIGHT)
    } while (terrain[y][x] === 'water')

    terrain[y][x] = 'portal'
    
    return {
      id: idx,
      x,
      y,
      targetWorldId: targetId
    }
  })

  return {
    id: worldId,
    name: `World ${worldId + 1}`,
    grid: terrain,
    portals,
  }
}
