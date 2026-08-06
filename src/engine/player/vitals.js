export const STAMINA_MAX = 100
export const CONSTITUTION_MAX = 100

const TERRAIN_STAMINA_COST = {
  rock: 2,
  hill: 1,
  water: 3
}

export function getTerrainStaminaCost(terrainType) {
  return TERRAIN_STAMINA_COST[terrainType] || 0
}

const EXHAUSTION_CONSTITUTION_COST = 1

export function applyMovementCost(player, terrainType) {
  const wasExhausted = player.stamina <= 0
  const cost = getTerrainStaminaCost(terrainType)

  const stamina = Math.max(0, player.stamina - cost)
  const constitution = wasExhausted
    ? Math.max(0, player.constitution - EXHAUSTION_CONSTITUTION_COST)
    : player.constitution

  return { ...player, stamina, constitution }
}

const REGEN_AMOUNT = 1

export function regenStamina(player) {
  if (player.stamina >= STAMINA_MAX) return player
  return { ...player, stamina: Math.min(STAMINA_MAX, player.stamina + REGEN_AMOUNT) }
}

export function applyRestore(player, restore) {
  if (!restore) return player

  let stamina = player.stamina
  let constitution = player.constitution

  if (typeof restore.stamina === 'number') {
    stamina = Math.min(STAMINA_MAX, stamina + restore.stamina)
  }

  if (restore.constitution === 'full') {
    constitution = CONSTITUTION_MAX
  } else if (typeof restore.constitution === 'number') {
    constitution = Math.min(CONSTITUTION_MAX, constitution + restore.constitution)
  }

  return { ...player, stamina, constitution }
}

export function isDead(player) {
  return player.constitution <= 0
}
