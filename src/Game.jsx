import { useEffect, useRef, useState } from 'react'
import { generateNetwork, WORLD_COUNT } from './worldNetwork'
import InteractionModal from './InteractionModal'
import { NPCS } from './data/npcData'
import { ITEMS } from './data/items'

function createNewGame() {
  const worlds = generateNetwork()
  return {
    worlds,
    currentWorldId: 0,
    player: { 
      x: 5, 
      y: 5,
      inventory: []
    }
  }
}

function terrainLabel(t) {
  switch (t) {
    case 'plains': return 'Plains'
    case 'grass': return 'Grassland'
    case 'rough': return 'Rough'
    case 'hill': return 'Hills'
    case 'mountain': return 'Mountain'
    case 'rock': return 'Rock'
    case 'forest': return 'Forest'
    case 'swamp': return 'Swamp'
    case 'marsh': return 'Marsh'
    case 'water': return 'Water'
    case 'deepwater': return 'Deep Water'
    case 'portal': return 'Portal'
    default: return `Unknown (${t})`
  }
}

export default function Game() {
  const gridRef = useRef(null)
  const [game, setGame] = useState(() => createNewGame())

  // NEW: interaction modal state
  const [interaction, setInteraction] = useState(null)

  // ITEM PICKUP
  function pickUpItem(itemId) {
    const updated = {
      ...game,
      player: {
        ...game.player,
        inventory: [...game.player.inventory, itemId]
      }
    }
    setGame(updated)
    setInteraction(null)
  }

  // ENTITY INTERACTION HANDLER
  function handleInteraction(entity) {
    if (!entity) return

    // NPC
    if (entity.kind === 'npc') {
      const npc = NPCS[entity.id]
      if (!npc) return

      setInteraction({
        type: 'dialogue',
        text: npc.dialogue[0],
        npcId: entity.id
      })
      return
    }

    // ITEM
    if (entity.kind === 'item') {
      const item = ITEMS[entity.id]
      if (!item) return

      setInteraction({
        type: 'choices',
        text: `You found ${item.name}.`,
        choices: [
          { label: 'Pick up', action: () => pickUpItem(entity.id) },
          { label: 'Leave', action: () => setInteraction(null) }
        ]
      })
      return
    }
  }

  // MOVEMENT + PORTALS + INTERACTION
  useEffect(() => {
    if (!game) return

    function handleKey(e) {
      // If modal is open → block movement
      if (interaction) return

      const { player, worlds, currentWorldId } = game
      const world = worlds[currentWorldId]

      let dx = 0, dy = 0

      if (e.key === 'w' || e.key === 'ArrowUp') dy = -1
      if (e.key === 's' || e.key === 'ArrowDown') dy = 1
      if (e.key === 'a' || e.key === 'ArrowLeft') dx = -1
      if (e.key === 'd' || e.key === 'ArrowRight') dx = 1

      if (dx === 0 && dy === 0) return

      const newX = player.x + dx
      const newY = player.y + dy

      if (!world.grid[newY] || !world.grid[newY][newX]) return

      const cell = world.grid[newY][newX]

      // PORTAL
      if (cell === 'portal' || cell?.type === 'portal') {
        const portal = world.portals.find(p => p.x === newX && p.y === newY)
        if (portal) {
          setGame({
            ...game,
            currentWorldId: portal.targetWorldId,
            player: { x: 5, y: 5, inventory: [...player.inventory] }
          })
          return
        }
      }

      // ENTITY INTERACTION
      if (cell?.entity) {
        handleInteraction(cell.entity)
        return
      }

      // NORMAL MOVEMENT
      setGame({
        ...game,
        player: { 
          ...player,
          x: newX,
          y: newY
        }
      })
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [game, interaction])

  // CAMERA FOLLOW
  useEffect(() => {
    if (!gridRef.current || !game) return

    const cellSize = 16
    const scrollX = game.player.x * cellSize - gridRef.current.clientWidth / 2
    const scrollY = game.player.y * cellSize - gridRef.current.clientHeight / 2

    gridRef.current.scrollTo({
      left: scrollX,
      top: scrollY,
      behavior: 'smooth'
    })
  }, [game])

  if (!game) return <div>Loading…</div>

  const { worlds, currentWorldId, player } = game
  const world = worlds[currentWorldId]
  const width = world.grid[0].length
  const height = world.grid.length
  const playerTerrain = world.grid[player.y][player.x]

  return (
    <div className='game-root'>
      <div className='world-area'>
        <div
          ref={gridRef}
          className='grid-wrapper'
          style={{
            gridTemplateColumns: `repeat(${width}, 16px)`,
            gridTemplateRows: `repeat(${height}, 16px)`
          }}
        >
          {world.grid.map((row, y) =>
            row.map((cell, x) => {
              let cls = 'cell t-' + (cell.type || cell)

              if (player.x === x && player.y === y) cls = 'cell t-player'

              return (
                <div
                  key={`${x}-${y}`}
                  className={cls}
                ></div>
              )
            })
          )}
        </div>
      </div>

      <div className='side-panel'>
        <div className='side-title'>
          Þræscype
        </div>

        <div className='info-block'>
          <div>
            <strong>World:</strong> {currentWorldId + 1} / {WORLD_COUNT}
          </div>
          <div>
            <strong>Terrain:</strong> {terrainLabel(playerTerrain.type || playerTerrain)}
          </div>
          <div>
            <strong>Player:</strong> ({player.x}, {player.y})
          </div>
          <div>
            <strong>Portals:</strong> {world.portals.length}
          </div>
        </div>
      </div>

      <InteractionModal 
        data={interaction}
        onClose={
          () => setInteraction(null)
        }
      />
    </div>
  )
}
