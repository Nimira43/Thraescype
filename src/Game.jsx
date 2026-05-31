import { useEffect, useRef, useState } from 'react'
import { generateNetwork, WORLD_COUNT } from './worldNetwork'

function createNewGame() {
  const worlds = generateNetwork()
  return {
    worlds,
    currentWorldId: 0,
    player: { x: 5, y: 5 },
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
  
  useEffect(() => {
    if (!game) return

    function handleKey(e) {
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

      if (world.grid[newY][newX] === 'portal') {
        const portal = world.portals
          .find(p => p.x === newX && p.y === newY)
        
        if (portal) {
          setGame({
            ...game,
            currentWorldId: portal.targetWorldId,
            player: { x: 5, y: 5 },
          })
          return
        }
      }

      setGame({
        ...game,
        player: { x: newX, y: newY },
      })
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [game])

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
              let cls = 'cell t-' + cell
              
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
            <strong>Terrain:</strong> {terrainLabel(playerTerrain)}
          </div>
          <div>
            <strong>Player:</strong> ({player.x}, {player.y})
          </div>
          <div>
            <strong>Portals:</strong> {world.portals.length}
          </div>
        </div>
      </div>
    </div>
  )
}