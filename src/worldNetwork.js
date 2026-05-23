export const WORLD_COUNT = 20
export const PORTALS_PER_WORLD = 3

// Helper: create array [0..n-1]
const range = n =>
  Array.from({ length: n }, (_, i) => i)

// Generate a random 3-regular undirected graph (20 nodes, degree 3)
export function generateNetwork() {
  const worlds = range(WORLD_COUNT).map(i => ({
    id: i,
    name: `World ${i + 1}`,
    portals: [] // { targetWorldId, portalId } later add coordinates
  }))

  // Build edges as pairs [a, b]
  const degrees = Array(WORLD_COUNT).fill(0)
  const edges = []

  // Simple-ish approach: keep trying random pairs until all degrees == 3

  // (for 20 nodes, 3-regular, this is manageable)
  
  const maxAttempts = 100000
  let attempts = 0

  while (degrees.some(d => d < PORTALS_PER_WORLD) && attempts < maxAttempts) {
    attempts++

    const a = Math.floor(Math.random() * WORLD_COUNT)
    const b = Math.floor(Math.random() * WORLD_COUNT)

    if (a === b) continue

    // Already connected?
    if (edges.some(
      e => (
        e[0] === a && e[1] === b
      ) || (
        e[0] === b && e[1] === a)
      )
    ) {
      continue
    }

    // Degree limit
    if (
      degrees[a] >= PORTALS_PER_WORLD ||
      degrees[b] >= PORTALS_PER_WORLD
    ) {
      continue
    }

    edges.push([a, b])
    degrees[a]++
    degrees[b]++
  }

  // Very basic safety: if failed, try again
  if (degrees.some(d => d !== PORTALS_PER_WORLD)) {
    console.warn('Network generation failed, retrying...')
    return generateNetwork()
  }

  // Attach portals to worlds
  edges.forEach(([a, b]) => {
    worlds[a].portals.push(
      { targetWorldId: b }
    )
    worlds[b].portals.push(
      { targetWorldId: a }
    )
  })

  return worlds
}
