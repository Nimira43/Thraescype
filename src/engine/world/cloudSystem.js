import { CLOUD_SHAPE } from '../../data/entities/cloudShape'

// const CLOUD_COLOUR = 'rgba(220, 220, 220, 0.18)'
const CLOUD_COLOUR = 'rgb(255, 0, 0, 0.18)'

export function createCloud(worldCount, worldWidth, worldHeight) {
  return {
    worldId: Math.floor(Math.random() * worldCount),
    x: randomAnchorX(worldWidth),
    y: randomAnchorY(worldHeight),
    colour: CLOUD_COLOUR
  }
}

function randomAnchorX(worldWidth) {
  return Math.floor(Math.random() * (worldWidth - CLOUD_SHAPE.width))
}

function randomAnchorY(worldHeight) {
  return Math.floor(Math.random() * (worldHeight - CLOUD_SHAPE.height))
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

export function stepCloud(cloud, worldCount, worldWidth, worldHeight, jumpChance = 0.04) {
  if (Math.random() < jumpChance) {
    let nextWorldId = cloud.worldId

    if (worldCount > 1) {
      do {
        nextWorldId = Math.floor(Math.random() * worldCount)
      } while (nextWorldId === cloud.worldId)
    }

    return {
      ...cloud,
      worldId: nextWorldId,
      x: randomAnchorX(worldWidth),
      y: randomAnchorY(worldHeight)
    }
  }

  const dx = Math.floor(Math.random() * 3) - 1 
  const dy = Math.floor(Math.random() * 3) - 1

  const maxX = worldWidth - CLOUD_SHAPE.width
  const maxY = worldHeight - CLOUD_SHAPE.height

  return {
    ...cloud,
    x: clamp(cloud.x + dx, 0, maxX),
    y: clamp(cloud.y + dy, 0, maxY)
  }
}

export function getCloudCells(cloud) {
  const cells = new Set()
  CLOUD_SHAPE.offsets.forEach(({ dx, dy }) => {
    cells.add(`${cloud.x + dx},${cloud.y + dy}`)
  })
  return cells
}