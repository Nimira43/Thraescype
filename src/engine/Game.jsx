import { useEffect, useRef, useState } from 'react'
import { generateNetwork, WORLD_COUNT } from '../engine/world/worldNetwork'
import InteractionModal from './interaction/InteractionModal'
import { NPCS } from '../data/entities/npcData'
import { ITEMS } from '../data/entities/items'
import { DIALOGUE_TREES } from '../data/dialog/dialogTrees'
import { startDialogue, chooseDialogueOption, createGamebookState } from '../engine/gamebook'
import '../data/quests' // side-effect: registers quest definitions

function createNewGame() {
  const worlds = generateNetwork()
  return {
    worlds,
    currentWorldId: 0,
    player: {
      x: 5,
      y: 5,
      ...createGamebookState() // gives flags: {}, quests: {}, inventory: []
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
  const [interaction, setInteraction] = useState(null)

  function pickUpItem(itemId, x, y) {
    setGame(prev => {
      const worlds = [...prev.worlds]
      const worldIndex = prev.currentWorldId
      const world = { ...worlds[worldIndex] }

      const newGrid = world.grid.map(row =>
        row.map(cell => ({ ...cell }))
      )

      newGrid[y][x] = {
        ...newGrid[y][x],
        entity: null
      }

      world.grid = newGrid
      worlds[worldIndex] = world

      return {
        ...prev,
        worlds,
        player: {
          ...prev.player,
          inventory: [...prev.player.inventory, itemId]
        }
      }
    })

    setInteraction(null)
  }

 // Dialogue + Item Interaction
  function handleInteraction(entity, x, y, playerState) {
    if (!entity) return

    if (entity.kind === 'npc') {
      const npc = NPCS[entity.id]
      const tree = npc && DIALOGUE_TREES[npc.dialogueTreeId]
      if (!tree) return

      const showDialogue = (view, gamebookState) => {
        if (!view) { setInteraction(null); return }

        setInteraction({
          type: 'dialogue',
          view,
          onChoice: (choiceIdx) => {
            const result = chooseDialogueOption(tree, gamebookState, view.nodeId, choiceIdx)

            // persist any setFlag/giveItem/startQuest/etc effects onto the player
            setGame(prev => ({
              ...prev,
              player: { ...prev.player, ...result.state }
            }))

            if (result.isEnd || !result.view) {
              setInteraction(null)
              return
            }

            showDialogue(result.view, result.state)
          }
        })
      }

      const { view, state } = startDialogue(tree, playerState)
      showDialogue(view, state)
      return
    }

    if (entity.kind === 'item') {
      const item = ITEMS[entity.id]
      if (!item) return

      setInteraction({
        type: 'item',
        item,
        choices: [
          { label: 'Pick up', action: () => pickUpItem(entity.id, x, y) },
          { label: 'Leave', action: () => setInteraction(null) }
        ]
      })
      return
    }
  }

  // MOVEMENT + PORTALS + ENTITY INTERACTION
  useEffect(() => {
    if (!game) return

    function handleKey(e) {
      // Lock movement only during dialogue
      if (interaction?.type === 'dialogue') return

      setGame(prev => {
        const { player, worlds, currentWorldId } = prev
        const world = worlds[currentWorldId]

        let dx = 0, dy = 0

        if (e.key === 'w' || e.key === 'ArrowUp') dy = -1
        if (e.key === 's' || e.key === 'ArrowDown') dy = 1
        if (e.key === 'a' || e.key === 'ArrowLeft') dx = -1
        if (e.key === 'd' || e.key === 'ArrowRight') dx = 1

        if (dx === 0 && dy === 0) return prev

        const newX = player.x + dx
        const newY = player.y + dy

        if (!world.grid[newY] || !world.grid[newY][newX]) return prev

        const cell = world.grid[newY][newX]

        // PORTAL
        if (cell.type === 'portal') {
          const portal = world.portals.find(p => p.x === newX && p.y === newY)
          if (portal) {
            return {
              ...prev,
              currentWorldId: portal.targetWorldId,
              player: {
                ...player,
                x: 5,
                y: 5
              }
            }
          }
        }

        // ENTITY INTERACTION
        if (cell.entity) {
          handleInteraction(cell.entity, newX, newY, player)
          return prev
        }

        // MOVE
        return {
          ...prev,
          player: {
            ...player,
            x: newX,
            y: newY
          }
        }
      })
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [interaction, game])

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
              let cls = `cell t-${cell.type}`

              if (cell.entity?.kind === 'npc') cls += ' has-npc'
              if (cell.entity?.kind === 'item') cls += ' has-item'

              if (player.x === x && player.y === y) {
                cls = 'cell t-player'
              }

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
        <div className='side-title'>Þræscype</div>

        <div className='info-block'>
          <div>
            <strong>World:</strong> {currentWorldId + 1} / {WORLD_COUNT}
          </div>
          <div>
            <strong>Terrain:</strong> {terrainLabel(playerTerrain.type)}
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
        onClose={() => setInteraction(null)}
      />
    </div>
  )
}
