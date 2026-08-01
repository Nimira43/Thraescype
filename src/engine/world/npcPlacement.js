import { placeNPC } from './worldGenerator'

const BYSTANDER_IDS = [
  'wulfstan_wanderer',
  'mildburg_forager',
  'cenric_the_wary',
  'eadgyth_traveller',
  'ealdred_elder',
  'frithuswith_chronicler',
  'godwine_ironhand',
  'hilda_devout',
  'ecgbert_the_lost',
  'wynflaed_wild'
]

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

export function placeBystanders(worlds) {
  BYSTANDER_IDS.forEach(npcId => {
    const world = worlds[Math.floor(Math.random() * worlds.length)]
    const tile = findQualifyingTile(world)
    if (!tile) return 
    placeNPC(world, npcId, tile.x, tile.y)
  })
}