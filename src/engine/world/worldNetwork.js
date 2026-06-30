import { generateWorld} from './worldGenerator'

export const WORLD_COUNT = 20
export const PORTALS_PER_WORLD = 3

const range = n => Array.from({ length: n }, (_, i) => i)

export function generateNetwork() {
  const worlds = range(WORLD_COUNT).map(i => ({
    id: i,
    portals: [],
  }))

  const degrees = Array(WORLD_COUNT).fill(0)
  const edges = []
  const maxAttempts = 100000
  let attempts = 0

  while (
    degrees.some(d => d < PORTALS_PER_WORLD) &&
    attempts < maxAttempts
  ) {
    attempts++

    const a = Math.floor(Math.random() * WORLD_COUNT)
    const b = Math.floor(Math.random() * WORLD_COUNT)
    
    if (a === b) continue
    
    if (
      edges.some(
        e =>
          (e[0] === a && e[1] === b) ||
          (e[0] === b && e[1] === a)
      )
    ) continue
    
    if (
      degrees[a] >= PORTALS_PER_WORLD ||
      degrees[b] >= PORTALS_PER_WORLD
    ) continue

    edges.push([a, b])
    degrees[a]++
    degrees[b]++
  }

  edges.forEach(([a, b]) => {
    worlds[a].portals.push(b)
    worlds[b].portals.push(a)
  })

  return worlds
    .map(w => generateWorld(w.id, w.portals))
}
