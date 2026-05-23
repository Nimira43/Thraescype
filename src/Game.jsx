import { useEffect, useState } from 'react'
import { generateNetwork, WORLD_COUNT } from './worldNetwork'
import { saveGame, loadGame, clearGame } from './storage'

function createNewGame() {
  const worlds = generateNetwork()
  return {
    worlds,
    currentWorldId: 0, // World 1
    player: { x: 0, y: 0 }, // placeholder
  }
}

export default function Game() {
  const [game, setGame] = useState(null)

  // On mount: load or create
  useEffect(() => {
    const loaded = loadGame()
    if (loaded) {
      setGame(loaded)
    } else {
      const fresh = createNewGame()
      setGame(fresh)
      saveGame(fresh)
    }
  }, [])

  if (!game) return (
    <div>
      Loading ÞRÆSCYPE…
    </div>
  )

  const { worlds, currentWorldId } = game
  const currentWorld = worlds[currentWorldId]

  function goToWorld(targetWorldId) {
    const updated = {
      ...game,
      currentWorldId: targetWorldId,
      // later: set player spawn based on portal coordinates
    }
    setGame(updated)
    saveGame(updated)
  }

  function handleNewGame() {
    clearGame()
    const fresh = createNewGame()
    setGame(fresh)
    saveGame(fresh)
  }

  return (
    <div className='game-container'>
      
      <header className='game-header'>  
        <h1 className='logo-font'>
          Þræscype
        </h1>
        <div className='info-box'>
          <span>
            World {currentWorldId + 1} / {WORLD_COUNT}
          </span>
          <button
            className='btn'
            onClick={handleNewGame}>
            New Sandbox
          </button>
        </div>
      </header>

      <main className='game-area-wrapper'>
        <div className='game-area'>
          
          <div>
            <div>
              World name: {currentWorld.name}
            </div>
            <div>
              Portals from here:
            </div>
            <ul>
              {currentWorld.portals
                .map((p, idx) => (
                  <li key={idx}>
                    Portal {idx + 1} → World {p.targetWorldId + 1}{' '}
                    <button
                      className='btn'
                      onClick={
                        () => goToWorld(p.targetWorldId)
                      }>Enter
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>

          <div>
            {/* Placeholder for the actual grid */}
            <div>
              Grid placeholder (80% VH/VW world will go here)
            </div>
            <div>
              Player position: ({game.player.x}, {game.player.y})
            </div>
          </div>

        </div>
      </main>

    </div>
  )
}
