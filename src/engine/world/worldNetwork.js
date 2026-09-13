// World Network - Version 2

import { generateWorld, WIDTH, HEIGHT } from './worldGenerator'
import { placeWitchsLair } from './witchsLair'
import { placeBystanders } from './npcPlacement'
import { placeEadricQuest } from './eadricPlacement'
import { placeEverlastingPlant } from './plantPlacement'

export const WORLD_COUNT = 20
export const PORTALS_PER_WORLD = 3

const range = n => Array.from({ length: n }, (_, i) => i)

function buildNetworkEdges() {
  const degrees = Array(WORLD_COUNT).fill(0)
  const edges = []

  const edgeExists = (a, b) =>
    edges.some(e => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a))

  function addEdge(a, b) {
    edges.push([a, b])
    degrees[a]++
    degrees[b]++
  }

  const order = range(WORLD_COUNT)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  for (let i = 0; i < order.length; i++) {
    addEdge(order[i], order[(i + 1) % order.length])
  }

  const maxAttempts = 5000
  let attempts = 0

  while (
    degrees.some(d => d < PORTALS_PER_WORLD) &&
    attempts < maxAttempts
  ) {
    attempts++

    const a = Math.floor(Math.random() * WORLD_COUNT)
    const b = Math.floor(Math.random() * WORLD_COUNT)

    if (a === b) continue
    if (degrees[a] >= PORTALS_PER_WORLD || degrees[b] >= PORTALS_PER_WORLD) continue
    if (edgeExists(a, b)) continue

    addEdge(a, b)
  }

  return degrees.every(d => d === PORTALS_PER_WORLD) ? edges : null
}

export function generateNetwork() {
  const worlds = range(WORLD_COUNT).map(i => ({
    id: i,
    portals: [],
  }))

  const maxNetworkRetries = 200
  let edges = null

  for (let i = 0; i < maxNetworkRetries; i++) {
    edges = buildNetworkEdges()
    if (edges) break
  }

  if (!edges) edges = []

  edges.forEach(([a, b]) => {
    worlds[a].portals.push(b)
    worlds[b].portals.push(a)
  })

  const generatedWorlds = worlds
    .map(w => generateWorld(w.id, w.portals))

  const lairWorldIndex = Math.floor(Math.random() * generatedWorlds.length)
  placeWitchsLair(generatedWorlds[lairWorldIndex], WIDTH, HEIGHT)

  placeBystanders(generatedWorlds)

  placeEadricQuest(generatedWorlds)

  placeEverlastingPlant(generatedWorlds)

  return generatedWorlds
}

// World Network - Version 1

// import { generateWorld, WIDTH, HEIGHT } from './worldGenerator'
// import { placeWitchsLair } from './witchsLair'
// import { placeBystanders } from './npcPlacement'
// import { placeEadricQuest } from './eadricPlacement'
// import { placeEverlastingPlant } from './plantPlacement'

// export const WORLD_COUNT = 20
// export const PORTALS_PER_WORLD = 3

// const range = n => Array.from({ length: n }, (_, i) => i)

// export function generateNetwork() {
//   const worlds = range(WORLD_COUNT).map(i => ({
//     id: i,
//     portals: [],
//   }))

//   const degrees = Array(WORLD_COUNT).fill(0)
//   const edges = []
//   const maxAttempts = 100000
//   let attempts = 0

//   while (
//     degrees.some(d => d < PORTALS_PER_WORLD) &&
//     attempts < maxAttempts
//   ) {
//     attempts++

//     const a = Math.floor(Math.random() * WORLD_COUNT)
//     const b = Math.floor(Math.random() * WORLD_COUNT)

//     if (a === b) continue

//     if (
//       edges.some(
//         e =>
//           (e[0] === a && e[1] === b) ||
//           (e[0] === b && e[1] === a)
//       )
//     ) continue

//     if (
//       degrees[a] >= PORTALS_PER_WORLD ||
//       degrees[b] >= PORTALS_PER_WORLD
//     ) continue

//     edges.push([a, b])
//     degrees[a]++
//     degrees[b]++
//   }

//   edges.forEach(([a, b]) => {
//     worlds[a].portals.push(b)
//     worlds[b].portals.push(a)
//   })

//   const generatedWorlds = worlds
//     .map(w => generateWorld(w.id, w.portals))

//   const lairWorldIndex = Math.floor(Math.random() * generatedWorlds.length)
//   placeWitchsLair(generatedWorlds[lairWorldIndex], WIDTH, HEIGHT)

//   placeBystanders(generatedWorlds)

//   placeEadricQuest(generatedWorlds)

//   placeEverlastingPlant(generatedWorlds)

//   return generatedWorlds
// }