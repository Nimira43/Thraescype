import { useEffect, useRef, useState } from 'react'
import { generateNetwork, WORLD_COUNT } from '../engine/world/worldNetwork'
import { WIDTH as WORLD_WIDTH, HEIGHT as WORLD_HEIGHT } from '../engine/world/worldGenerator'
import { createCloud, stepCloud, getCloudCells } from '../engine/world/cloudSystem'
import { stepBoars } from '../engine/world/boarSystem'
import { saveGame, loadGame, clearGame } from './save/storage'
import { getTotalWeight, getCapacity, canCarry } from './inventory/weight'
import { findRecipe } from './inventory/recipes'
import {
  STAMINA_MAX,
  CONSTITUTION_MAX,
  applyMovementCost,
  regenStamina,
  applyRestore,
  isDead
} from './player/vitals'
import InteractionModal from './interaction/InteractionModal'
import { NPCS } from '../data/entities/npcData'
import { ITEMS } from '../data/entities/items'
import { DIALOGUE_TREES } from '../data/dialog/dialogTrees'
import { startDialogue, chooseDialogueOption, createGamebookState } from '../engine/gamebook'
import '../data/quests' 

function createNewGame() {
  const worlds = generateNetwork()
  return {
    worlds,
    currentWorldId: 0,
    player: {
      x: 5,
      y: 5,
      stamina: STAMINA_MAX,
      constitution: CONSTITUTION_MAX,
      ...createGamebookState({ inventory: ['piece_of_metal'] })
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

function maybeTransformStick(player) {
  if (player.flags.stick_transformed) return player
  if (!player.flags.book_read) return player
  if (!player.inventory.includes('wooden_stick')) return player

  const inventory = [...player.inventory]
  inventory[inventory.indexOf('wooden_stick')] = 'wooden_codex'

  return {
    ...player,
    inventory,
    flags: { ...player.flags, stick_transformed: true }
  }
}

function triggerClueG(setGame, setInteraction) {
  setGame(prev => ({
    ...prev,
    player: {
      ...prev.player,
      flags: { ...prev.player.flags, clue_g_done: true }
    }
  }))

  setInteraction({
    type: 'message',
    title: 'A Memory',
    text: "A vivid memory grips you, sudden and violent. You are in a large chamber, a great opening torn into the roof above. You recognise them at once — Arian. Rylaine. Yourself. Others gathered close, all standing around a weapon: a vast, fiery missile, humming with barely-contained power.\n\nAries bursts into the chamber, shouting for Arian to stop. It is you who moves first — you strike him down from behind before he can reach the bomb. Rylaine steps close. Something rises from within you, a shimmering field spreading outward, wrapping around yourself and, just barely, around her.\n\nThen the Firia bomb detonates."
  })
}

export default function Game() {
  const gridRef = useRef(null)
  const [game, setGame] = useState(() => loadGame() || createNewGame())
  const [interaction, setInteraction] = useState(null)
  const [cloud, setCloud] = useState(() => createCloud(WORLD_COUNT, WORLD_WIDTH, WORLD_HEIGHT))
  const [boars, setBoars] = useState([])

  const worldsRef = useRef(game.worlds)
  useEffect(() => {
    worldsRef.current = game.worlds
  }, [game.worlds])

  function handleNewGame() {
    clearGame()
    setGame(createNewGame())
    setCloud(createCloud(WORLD_COUNT, WORLD_WIDTH, WORLD_HEIGHT))
    setBoars([])
    setInteraction(null)
  }

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

      let player = {
        ...prev.player,
        inventory: [...prev.player.inventory, itemId]
      }

      if (itemId === 'everlasting_plant') {
        player = {
          ...player,
          flags: { ...player.flags, clue_c_found: true },
          quests: { ...player.quests, clue_c_plant: 'completed' }
        }
      }

      return { ...prev, worlds, player }
    })

    setInteraction(null)
  }

  function dropItem(index) {
    setGame(prev => {
      const inventory = [...prev.player.inventory]
      inventory.splice(index, 1)

      return {
        ...prev,
        player: { ...prev.player, inventory }
      }
    })

    setInteraction(null)
  }

  function consumeItem(itemId, index) {
    const item = ITEMS[itemId]
    if (!item?.restore) return

    setGame(prev => {
      const inventory = [...prev.player.inventory]
      inventory.splice(index, 1)

      const restoredPlayer = applyRestore({ ...prev.player, inventory }, item.restore)

      return { ...prev, player: restoredPlayer }
    })

    setInteraction(null)
  }

  function readBook(itemId) {
    if (itemId !== 'old_book') return

    const alreadyTransformed = game.player.flags.stick_transformed
    const hasStick = game.player.inventory.includes('wooden_stick')
    const willTransform = !alreadyTransformed && hasStick

    setGame(prev => {
      const player = maybeTransformStick({
        ...prev.player,
        flags: { ...prev.player.flags, book_read: true }
      })
      return { ...prev, player }
    })

    const closingLine = willTransform
      ? "\n\nThe moment you read her name, the polished stick in your pack judders — wood splitting open along hidden seams, engravings surfacing where none were carved before. It isn't a stick anymore."
      : ''

    setInteraction({
      type: 'message',
      title: 'Old Book',
      text: "The pages are dense, hurried in places, as if written in secret. It speaks of Arian — a general as brilliant as he was cruel, who gathered the brightest minds and mages of the Empire into a single order: the Alchemists. It was they who forged the Firia weapons, missile and bomb alike, at Arian's word. One name recurs more than any other in these pages — a scientist who worked closest of all beside him.\n\nRylaine." + closingLine
    })
  }

  function attemptCombine(selectedIndices) {
    if (selectedIndices.length < 2) {
      setInteraction({ type: 'message', text: 'Select at least two items to combine.' })
      return
    }

    const inventory = game.player.inventory
    const selectedIds = selectedIndices.map(i => inventory[i])
    const recipe = findRecipe(selectedIds)

    if (!recipe) {
      setInteraction({ type: 'message', text: "Nothing happens. These don't seem to belong together." })
      return
    }

    setGame(prev => {
      const keepSet = new Set(recipe.keep || [])
      const newInventory = [...prev.player.inventory]

      const indicesToRemove = selectedIndices
        .filter(i => !keepSet.has(newInventory[i]))
        .sort((a, b) => b - a)

      indicesToRemove.forEach(i => newInventory.splice(i, 1))
      newInventory.push(recipe.result)

      return { ...prev, player: { ...prev.player, inventory: newInventory } }
    })

    setInteraction({ type: 'message', text: recipe.narrative })
  }

  function eatEverlastingPlant(index) {
    setGame(prev => {
      const inventory = [...prev.player.inventory]
      inventory.splice(index, 1)

      return {
        ...prev,
        player: {
          ...prev.player,
          inventory,
          flags: { ...prev.player.flags, thraescype_awakened: true }
        }
      }
    })

    setInteraction({
      type: 'message',
      title: 'The Everlasting Flower',
      text: 'You eat the flower. For a moment, nothing. Then everything.\n\nMemory floods back — not gently, but all at once, a lifetime unspooling behind your eyes faster than you can hold it. Rylaine. The chamber. The bomb. Yourself, as you truly were.\n\nYou remember who you are now.'
    })
  }

  function viewInventoryItem(itemId, index) {
    const item = ITEMS[itemId]
    if (!item) return

    const choices = []

    if (item.restore) {
      choices.push({ label: 'Consume', action: () => consumeItem(itemId, index) })
    }

    if (itemId === 'everlasting_plant' && game.player.flags.confrontation_done) {
      choices.push({ label: 'Eat', action: () => eatEverlastingPlant(index) })
    }

    if (item.category === 'lore') {
      choices.push({ label: 'Read', action: () => readBook(itemId) })
    }

    choices.push(
      { label: 'Drop', action: () => dropItem(index) },
      { label: 'Close', action: () => setInteraction(null) }
    )

    setInteraction({ type: 'item', item, choices })
  }

  function showInventory({ combineMode, selectedIndices }) {
    setInteraction({
      type: 'inventory',
      items: game.player.inventory,
      combineMode,
      selectedIndices,
      onSelect: (itemId, idx) => {
        if (combineMode) {
          const nextSelected = selectedIndices.includes(idx)
            ? selectedIndices.filter(i => i !== idx)
            : [...selectedIndices, idx]
          showInventory({ combineMode, selectedIndices: nextSelected })
        } else {
          viewInventoryItem(itemId, idx)
        }
      },
      onToggleCombineMode: () => {
        showInventory({ combineMode: !combineMode, selectedIndices: [] })
      },
      onCombine: () => attemptCombine(selectedIndices)
    })
  }

  function openInventory() {
    showInventory({ combineMode: false, selectedIndices: [] })
  }

  function huntBoar(boarId) {
    setGame(prev => ({
      ...prev,
      player: {
        ...prev.player,
        inventory: [...prev.player.inventory, 'boar_meat']
      }
    }))
    setBoars(prev => prev.filter(b => b.id !== boarId))
    setInteraction(null)
  }

  function handleBoarEncounter(playerState, boarId) {
    const overweight = !canCarry(playerState.inventory, 'boar_meat')

    const choices = [
      { label: 'Leave', action: () => setInteraction(null) }
    ]

    if (!overweight) {
      choices.unshift({ label: 'Hunt', action: () => huntBoar(boarId) })
    }

    setInteraction({
      type: 'item',
      item: {
        name: 'Wild Boar',
        description: "A boar, tense and wary, watching you from the treeline. It hasn't noticed you yet."
      },
      overweight,
      choices
    })
  }

  function handleCloudEncounter(playerState) {
    const tree = DIALOGUE_TREES['cloud_encounter']
    if (!tree) return

    const showDialogue = (view, gamebookState) => {
      if (!view) { setInteraction(null); return }

      setInteraction({
        type: 'dialogue',
        view,
        onChoice: (choiceIdx) => {
          const result = chooseDialogueOption(tree, gamebookState, view.nodeId, choiceIdx)

          setGame(prev => ({
            ...prev,
            player: maybeTransformStick({ ...prev.player, ...result.state })
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
  }

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
            const justCompletedClueF = !gamebookState.flags.clue_f_done && result.state.flags.clue_f_done

            setGame(prev => ({
              ...prev,
              player: maybeTransformStick({ ...prev.player, ...result.state })
            }))

            if (justCompletedClueF) {
              triggerClueG(setGame, setInteraction)
              return
            }

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

      const overweight = !canCarry(playerState.inventory, entity.id)

      const choices = [
        { label: 'Leave', action: () => setInteraction(null) }
      ]

      if (!overweight) {
        choices.unshift({ label: 'Pick up', action: () => pickUpItem(entity.id, x, y) })
      }

      setInteraction({
        type: 'item',
        item,
        overweight,
        choices
      })
      return
    }
  }

  useEffect(() => {
    if (!game) return

    function handleKey(e) {
      if (e.repeat) return

      if (interaction?.type === 'dialogue') return

      setGame(prev => {
        const { player, worlds, currentWorldId } = prev

        if (isDead(player)) return prev

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

        if (cell.type === 'mountain') return prev

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

        if (
          player.flags.cloud_is_aries &&
          cloud.worldId === currentWorldId &&
          getCloudCells(cloud).has(`${newX},${newY}`)
        ) {
          handleCloudEncounter(player)
          return prev
        }

        // BOAR ENCOUNTER
        const encounteredBoar = boars.find(
          b => b.worldId === currentWorldId && b.x === newX && b.y === newY
        )
        if (encounteredBoar) {
          handleBoarEncounter(player, encounteredBoar.id)
          return prev
        }

        if (cell.entity) {
          handleInteraction(cell.entity, newX, newY, player)
          return prev
        }

        return {
          ...prev,
          player: {
            ...applyMovementCost(player, cell.type),
            x: newX,
            y: newY
          }
        }
      })
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [interaction, game, boars, cloud])

  // CLOUD DRIFT
  useEffect(() => {
    const interval = setInterval(() => {
      setCloud(prev => stepCloud(prev, WORLD_COUNT, WORLD_WIDTH, WORLD_HEIGHT))
    }, 900)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setBoars(prev => stepBoars(prev, worldsRef.current))
    }, 900)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setGame(prev => {
        if (isDead(prev.player)) return prev
        return { ...prev, player: regenStamina(prev.player) }
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!game) return

    const timeout = setTimeout(() => {
      saveGame(game)
    }, 300)

    return () => clearTimeout(timeout)
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
  const cloudCells = cloud.worldId === currentWorldId ? getCloudCells(cloud) : null
  const totalWeight = getTotalWeight(player.inventory)
  const capacity = getCapacity(player.inventory)
  const gameOver = isDead(player)

  const boarCells = new Set(
    boars
      .filter(b => b.worldId === currentWorldId)
      .map(b => `${b.x},${b.y}`)
  )

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
              let style

              if (cell.entity?.kind === 'npc') cls += ' has-npc'
              if (cell.entity?.kind === 'item') {
                cls += ITEMS[cell.entity.id]?.questItem ? ' has-quest-item' : ' has-item'
              }

              if (boarCells.has(`${x},${y}`)) {
                cls += ' has-boar'
              }

              if (cloudCells?.has(`${x},${y}`)) {
                style = { backgroundImage: `linear-gradient(${cloud.colour}, ${cloud.colour})` }
              }

              if (player.x === x && player.y === y) {
                cls = 'cell t-player'
                style = undefined
              }

              return (
                <div
                  key={`${x}-${y}`}
                  className={cls}
                  style={style}
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
            <strong>Terrain:</strong> {terrainLabel(playerTerrain.type)}
          </div>
          <div>
            <strong>Player:</strong> ({player.x}, {player.y})
          </div>
          <div>
            <strong>Portals:</strong> {world.portals.length}
          </div>
          <div>
            <strong>Weight:</strong> {totalWeight} / {capacity}
          </div>
          <div>
            <strong>Stamina:</strong> {player.stamina} / {STAMINA_MAX}
          </div>
          <div>
            <strong>Constitution:</strong> {player.constitution} / {CONSTITUTION_MAX}
          </div>
        </div>

        <button
          className='modal-btn'
          onClick={openInventory}
        >
          Inventory ({player.inventory.length})
        </button>

        <button
          className='modal-btn'
          onClick={handleNewGame}
        >
          New Game
        </button>
      </div>

      <InteractionModal
        data={interaction}
        onClose={() => setInteraction(null)}
      />

      {gameOver && (
        <div className='modal-overlay'>
          <div className='modal-box'>
            <p className='modal-text'>
              Your strength has failed you. The Fractured Worlds claim another.
            </p>
            <div className='modal-choices'>
              <button className='modal-btn' onClick={handleNewGame}>
                New Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




// import { useEffect, useRef, useState } from 'react'
// import { generateNetwork, WORLD_COUNT } from '../engine/world/worldNetwork'
// import { WIDTH as WORLD_WIDTH, HEIGHT as WORLD_HEIGHT } from '../engine/world/worldGenerator'
// import { createCloud, stepCloud, getCloudCells } from '../engine/world/cloudSystem'
// import { stepBoars } from '../engine/world/boarSystem'
// import { saveGame, loadGame, clearGame } from './save/storage'
// import { getTotalWeight, getCapacity, canCarry } from './inventory/weight'
// import { findRecipe } from './inventory/recipes'
// import {
//   STAMINA_MAX,
//   CONSTITUTION_MAX,
//   applyMovementCost,
//   regenStamina,
//   applyRestore,
//   isDead
// } from './player/vitals'
// import InteractionModal from './interaction/InteractionModal'
// import { NPCS } from '../data/entities/npcData'
// import { ITEMS } from '../data/entities/items'
// import { DIALOGUE_TREES } from '../data/dialog/dialogTrees'
// import { startDialogue, chooseDialogueOption, createGamebookState } from '../engine/gamebook'
// import '../data/quests'

// function createNewGame() {
//   const worlds = generateNetwork()
//   return {
//     worlds,
//     currentWorldId: 0,
//     player: {
//       x: 5,
//       y: 5,
//       stamina: STAMINA_MAX,
//       constitution: CONSTITUTION_MAX,
//       ...createGamebookState({ inventory: ['piece_of_metal'] })
//     }
//   }
// }

// function terrainLabel(t) {
//   switch (t) {
//     case 'plains': return 'Plains'
//     case 'grass': return 'Grassland'
//     case 'rough': return 'Rough'
//     case 'hill': return 'Hills'
//     case 'mountain': return 'Mountain'
//     case 'rock': return 'Rock'
//     case 'forest': return 'Forest'
//     case 'swamp': return 'Swamp'
//     case 'marsh': return 'Marsh'
//     case 'water': return 'Water'
//     case 'deepwater': return 'Deep Water'
//     case 'portal': return 'Portal'
//     default: return `Unknown (${t})`
//   }
// }

// function maybeTransformStick(player) {
//   if (player.flags.stick_transformed) return player
//   if (!player.flags.book_read) return player
//   if (!player.inventory.includes('wooden_stick')) return player

//   const inventory = [...player.inventory]
//   inventory[inventory.indexOf('wooden_stick')] = 'wooden_codex'

//   return {
//     ...player,
//     inventory,
//     flags: { ...player.flags, stick_transformed: true }
//   }
// }

// function triggerClueG(setGame, setInteraction) {
//   setGame(prev => ({
//     ...prev,
//     player: {
//       ...prev.player,
//       flags: { ...prev.player.flags, clue_g_done: true }
//     }
//   }))

//   setInteraction({
//     type: 'message',
//     title: 'A Memory',
//     text: "A vivid memory grips you, sudden and violent. You are in a large chamber, a great opening torn into the roof above. You recognise them at once — Arian. Rylaine. Yourself. Others gathered close, all standing around a weapon: a vast, fiery missile, humming with barely-contained power.\n\nAries bursts into the chamber, shouting for Arian to stop. It is you who moves first — you strike him down from behind before he can reach the bomb. Rylaine steps close. Something rises from within you, a shimmering field spreading outward, wrapping around yourself and, just barely, around her.\n\nThen the Firia bomb detonates."
//   })
// }

// export default function Game() {
//   const gridRef = useRef(null)
//   const [game, setGame] = useState(() => loadGame() || createNewGame())
//   const [interaction, setInteraction] = useState(null)
//   const [cloud, setCloud] = useState(() => createCloud(WORLD_COUNT, WORLD_WIDTH, WORLD_HEIGHT))
//   const [boars, setBoars] = useState([])

//   const worldsRef = useRef(game.worlds)
//   useEffect(() => {
//     worldsRef.current = game.worlds
//   }, [game.worlds])

//   function handleNewGame() {
//     clearGame()
//     setGame(createNewGame())
//     setCloud(createCloud(WORLD_COUNT, WORLD_WIDTH, WORLD_HEIGHT))
//     setBoars([])
//     setInteraction(null)
//   }

//   function pickUpItem(itemId, x, y) {
//     setGame(prev => {
//       const worlds = [...prev.worlds]
//       const worldIndex = prev.currentWorldId
//       const world = { ...worlds[worldIndex] }

//       const newGrid = world.grid.map(row =>
//         row.map(cell => ({ ...cell }))
//       )

//       newGrid[y][x] = {
//         ...newGrid[y][x],
//         entity: null
//       }

//       world.grid = newGrid
//       worlds[worldIndex] = world

//       let player = {
//         ...prev.player,
//         inventory: [...prev.player.inventory, itemId]
//       }

//       if (itemId === 'everlasting_plant') {
//         player = {
//           ...player,
//           flags: { ...player.flags, clue_c_found: true },
//           quests: { ...player.quests, clue_c_plant: 'completed' }
//         }
//       }

//       return { ...prev, worlds, player }
//     })

//     setInteraction(null)
//   }

//   function dropItem(index) {
//     setGame(prev => {
//       const inventory = [...prev.player.inventory]
//       inventory.splice(index, 1)

//       return {
//         ...prev,
//         player: { ...prev.player, inventory }
//       }
//     })

//     setInteraction(null)
//   }

//   function consumeItem(itemId, index) {
//     const item = ITEMS[itemId]
//     if (!item?.restore) return

//     setGame(prev => {
//       const inventory = [...prev.player.inventory]
//       inventory.splice(index, 1)

//       const restoredPlayer = applyRestore({ ...prev.player, inventory }, item.restore)

//       return { ...prev, player: restoredPlayer }
//     })

//     setInteraction(null)
//   }

//   function readBook(itemId) {
//     if (itemId !== 'old_book') return

//     const alreadyTransformed = game.player.flags.stick_transformed
//     const hasStick = game.player.inventory.includes('wooden_stick')
//     const willTransform = !alreadyTransformed && hasStick

//     setGame(prev => {
//       const player = maybeTransformStick({
//         ...prev.player,
//         flags: { ...prev.player.flags, book_read: true }
//       })
//       return { ...prev, player }
//     })

//     const closingLine = willTransform
//       ? "\n\nThe moment you read her name, the polished stick in your pack judders — wood splitting open along hidden seams, engravings surfacing where none were carved before. It isn't a stick anymore."
//       : ''

//     setInteraction({
//       type: 'message',
//       title: 'Old Book',
//       text: "The pages are dense, hurried in places, as if written in secret. It speaks of Arian — a general as brilliant as he was cruel, who gathered the brightest minds and mages of the Empire into a single order: the Alchemists. It was they who forged the Firia weapons, missile and bomb alike, at Arian's word. One name recurs more than any other in these pages — a scientist who worked closest of all beside him.\n\nRylaine." + closingLine
//     })
//   }

//   function attemptCombine(selectedIndices) {
//     if (selectedIndices.length < 2) {
//       setInteraction({ type: 'message', text: 'Select at least two items to combine.' })
//       return
//     }

//     const inventory = game.player.inventory
//     const selectedIds = selectedIndices.map(i => inventory[i])
//     const recipe = findRecipe(selectedIds)

//     if (!recipe) {
//       setInteraction({ type: 'message', text: "Nothing happens. These don't seem to belong together." })
//       return
//     }

//     setGame(prev => {
//       const keepSet = new Set(recipe.keep || [])
//       const newInventory = [...prev.player.inventory]

//       const indicesToRemove = selectedIndices
//         .filter(i => !keepSet.has(newInventory[i]))
//         .sort((a, b) => b - a)

//       indicesToRemove.forEach(i => newInventory.splice(i, 1))
//       newInventory.push(recipe.result)

//       return { ...prev, player: { ...prev.player, inventory: newInventory } }
//     })

//     setInteraction({ type: 'message', text: recipe.narrative })
//   }


//   function viewInventoryItem(itemId, index) {
//     const item = ITEMS[itemId]
//     if (!item) return

//     const choices = []

//     if (item.restore) {
//       choices.push({ label: 'Consume', action: () => consumeItem(itemId, index) })
//     }

//     if (item.category === 'lore') {
//       choices.push({ label: 'Read', action: () => readBook(itemId) })
//     }

//     choices.push(
//       { label: 'Drop', action: () => dropItem(index) },
//       { label: 'Close', action: () => setInteraction(null) }
//     )

//     setInteraction({ type: 'item', item, choices })
//   }

//   function showInventory({ combineMode, selectedIndices }) {
//     setInteraction({
//       type: 'inventory',
//       items: game.player.inventory,
//       combineMode,
//       selectedIndices,
//       onSelect: (itemId, idx) => {
//         if (combineMode) {
//           const nextSelected = selectedIndices.includes(idx)
//             ? selectedIndices.filter(i => i !== idx)
//             : [...selectedIndices, idx]
//           showInventory({ combineMode, selectedIndices: nextSelected })
//         } else {
//           viewInventoryItem(itemId, idx)
//         }
//       },
//       onToggleCombineMode: () => {
//         showInventory({ combineMode: !combineMode, selectedIndices: [] })
//       },
//       onCombine: () => attemptCombine(selectedIndices)
//     })
//   }

//   function openInventory() {
//     showInventory({ combineMode: false, selectedIndices: [] })
//   }

//   function huntBoar(boarId) {
//     setGame(prev => ({
//       ...prev,
//       player: {
//         ...prev.player,
//         inventory: [...prev.player.inventory, 'boar_meat']
//       }
//     }))
//     setBoars(prev => prev.filter(b => b.id !== boarId))
//     setInteraction(null)
//   }

//   function handleBoarEncounter(playerState, boarId) {
//     const overweight = !canCarry(playerState.inventory, 'boar_meat')

//     const choices = [
//       { label: 'Leave', action: () => setInteraction(null) }
//     ]

//     if (!overweight) {
//       choices.unshift({ label: 'Hunt', action: () => huntBoar(boarId) })
//     }

//     setInteraction({
//       type: 'item',
//       item: {
//         name: 'Wild Boar',
//         description: "A boar, tense and wary, watching you from the treeline. It hasn't noticed you yet."
//       },
//       overweight,
//       choices
//     })
//   }

//   function handleCloudEncounter(playerState) {
//     const tree = DIALOGUE_TREES['cloud_encounter']
//     if (!tree) return

//     const showDialogue = (view, gamebookState) => {
//       if (!view) { setInteraction(null); return }

//       setInteraction({
//         type: 'dialogue',
//         view,
//         onChoice: (choiceIdx) => {
//           const result = chooseDialogueOption(tree, gamebookState, view.nodeId, choiceIdx)

//           setGame(prev => ({
//             ...prev,
//             player: maybeTransformStick({ ...prev.player, ...result.state })
//           }))

//           if (result.isEnd || !result.view) {
//             setInteraction(null)
//             return
//           }

//           showDialogue(result.view, result.state)
//         }
//       })
//     }

//     const { view, state } = startDialogue(tree, playerState)
//     showDialogue(view, state)
//   }

//   function handleInteraction(entity, x, y, playerState) {
//     if (!entity) return

//     if (entity.kind === 'npc') {
//       const npc = NPCS[entity.id]
//       const tree = npc && DIALOGUE_TREES[npc.dialogueTreeId]
//       if (!tree) return

//       const showDialogue = (view, gamebookState) => {
//         if (!view) { setInteraction(null); return }

//         setInteraction({
//           type: 'dialogue',
//           view,
//           onChoice: (choiceIdx) => {
//             const result = chooseDialogueOption(tree, gamebookState, view.nodeId, choiceIdx)
//             const justCompletedClueF = !gamebookState.flags.clue_f_done && result.state.flags.clue_f_done

//             setGame(prev => ({
//               ...prev,
//               player: maybeTransformStick({ ...prev.player, ...result.state })
//             }))

//             if (justCompletedClueF) {
//               triggerClueG(setGame, setInteraction)
//               return
//             }

//             if (result.isEnd || !result.view) {
//               setInteraction(null)
//               return
//             }

//             showDialogue(result.view, result.state)
//           }
//         })
//       }

//       const { view, state } = startDialogue(tree, playerState)
//       showDialogue(view, state)
//       return
//     }

//     if (entity.kind === 'item') {
//       const item = ITEMS[entity.id]
//       if (!item) return

//       const overweight = !canCarry(playerState.inventory, entity.id)

//       const choices = [
//         { label: 'Leave', action: () => setInteraction(null) }
//       ]

//       if (!overweight) {
//         choices.unshift({ label: 'Pick up', action: () => pickUpItem(entity.id, x, y) })
//       }

//       setInteraction({
//         type: 'item',
//         item,
//         overweight,
//         choices
//       })
//       return
//     }
//   }

//   useEffect(() => {
//     if (!game) return

//     function handleKey(e) {
//       if (e.repeat) return

//       if (interaction?.type === 'dialogue') return

//       setGame(prev => {
//         const { player, worlds, currentWorldId } = prev

//         if (isDead(player)) return prev

//         const world = worlds[currentWorldId]

//         let dx = 0, dy = 0

//         if (e.key === 'w' || e.key === 'ArrowUp') dy = -1
//         if (e.key === 's' || e.key === 'ArrowDown') dy = 1
//         if (e.key === 'a' || e.key === 'ArrowLeft') dx = -1
//         if (e.key === 'd' || e.key === 'ArrowRight') dx = 1

//         if (dx === 0 && dy === 0) return prev

//         const newX = player.x + dx
//         const newY = player.y + dy

//         if (!world.grid[newY] || !world.grid[newY][newX]) return prev

//         const cell = world.grid[newY][newX]

//         if (cell.type === 'mountain') return prev

//         if (cell.type === 'portal') {
//           const portal = world.portals.find(p => p.x === newX && p.y === newY)
//           if (portal) {
//             return {
//               ...prev,
//               currentWorldId: portal.targetWorldId,
//               player: {
//                 ...player,
//                 x: 5,
//                 y: 5
//               }
//             }
//           }
//         }

//         if (
//           player.flags.cloud_is_aries &&
//           cloud.worldId === currentWorldId &&
//           getCloudCells(cloud).has(`${newX},${newY}`)
//         ) {
//           handleCloudEncounter(player)
//           return prev
//         }

//         const encounteredBoar = boars.find(
//           b => b.worldId === currentWorldId && b.x === newX && b.y === newY
//         )
//         if (encounteredBoar) {
//           handleBoarEncounter(player, encounteredBoar.id)
//           return prev
//         }

//         if (cell.entity) {
//           handleInteraction(cell.entity, newX, newY, player)
//           return prev
//         }

//         return {
//           ...prev,
//           player: {
//             ...applyMovementCost(player, cell.type),
//             x: newX,
//             y: newY
//           }
//         }
//       })
//     }

//     window.addEventListener('keydown', handleKey)
//     return () => window.removeEventListener('keydown', handleKey)
//   }, [interaction, game, boars, cloud])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCloud(prev => stepCloud(prev, WORLD_COUNT, WORLD_WIDTH, WORLD_HEIGHT))
//     }, 900)

//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBoars(prev => stepBoars(prev, worldsRef.current))
//     }, 900)

//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setGame(prev => {
//         if (isDead(prev.player)) return prev
//         return { ...prev, player: regenStamina(prev.player) }
//       })
//     }, 4000)

//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     if (!game) return

//     const timeout = setTimeout(() => {
//       saveGame(game)
//     }, 300)

//     return () => clearTimeout(timeout)
//   }, [game])

//   // CAMERA FOLLOW
//   useEffect(() => {
//     if (!gridRef.current || !game) return

//     const cellSize = 16
//     const scrollX = game.player.x * cellSize - gridRef.current.clientWidth / 2
//     const scrollY = game.player.y * cellSize - gridRef.current.clientHeight / 2

//     gridRef.current.scrollTo({
//       left: scrollX,
//       top: scrollY,
//       behavior: 'smooth'
//     })
//   }, [game])

//   if (!game) return <div>Loading…</div>

//   const { worlds, currentWorldId, player } = game
//   const world = worlds[currentWorldId]
//   const width = world.grid[0].length
//   const height = world.grid.length
//   const playerTerrain = world.grid[player.y][player.x]
//   const cloudCells = cloud.worldId === currentWorldId ? getCloudCells(cloud) : null
//   const totalWeight = getTotalWeight(player.inventory)
//   const capacity = getCapacity(player.inventory)
//   const gameOver = isDead(player)

//   const boarCells = new Set(
//     boars
//       .filter(b => b.worldId === currentWorldId)
//       .map(b => `${b.x},${b.y}`)
//   )

//   return (
//     <div className='game-root'>
//       <div className='world-area'>
//         <div
//           ref={gridRef}
//           className='grid-wrapper'
//           style={{
//             gridTemplateColumns: `repeat(${width}, 16px)`,
//             gridTemplateRows: `repeat(${height}, 16px)`
//           }}
//         >
//           {world.grid.map((row, y) =>
//             row.map((cell, x) => {
//               let cls = `cell t-${cell.type}`
//               let style

//               if (cell.entity?.kind === 'npc') cls += ' has-npc'
//               if (cell.entity?.kind === 'item') {
//                 cls += ITEMS[cell.entity.id]?.questItem ? ' has-quest-item' : ' has-item'
//               }

//               if (boarCells.has(`${x},${y}`)) {
//                 cls += ' has-boar'
//               }

//               if (cloudCells?.has(`${x},${y}`)) {
//                 style = { backgroundImage: `linear-gradient(${cloud.colour}, ${cloud.colour})` }
//               }

//               if (player.x === x && player.y === y) {
//                 cls = 'cell t-player'
//                 style = undefined
//               }

//               return (
//                 <div
//                   key={`${x}-${y}`}
//                   className={cls}
//                   style={style}
//                 ></div>
//               )
//             })
//           )}
//         </div>
//       </div>

//       <div className='side-panel'>
//         <div className='side-title'>
//           Þræscype
//         </div>

//         <div className='info-block'>
//           <div>
//             <strong>World:</strong> {currentWorldId + 1} / {WORLD_COUNT}
//           </div>
//           <div>
//             <strong>Terrain:</strong> {terrainLabel(playerTerrain.type)}
//           </div>
//           <div>
//             <strong>Player:</strong> ({player.x}, {player.y})
//           </div>
//           <div>
//             <strong>Portals:</strong> {world.portals.length}
//           </div>
//           <div>
//             <strong>Weight:</strong> {totalWeight} / {capacity}
//           </div>
//           <div>
//             <strong>Stamina:</strong> {player.stamina} / {STAMINA_MAX}
//           </div>
//           <div>
//             <strong>Constitution:</strong> {player.constitution} / {CONSTITUTION_MAX}
//           </div>
//         </div>

//         <button
//           className='modal-btn'
//           onClick={openInventory}
//         >
//           Inventory ({player.inventory.length})
//         </button>

//         <button
//           className='modal-btn'
//           onClick={handleNewGame}
//         >
//           New Game
//         </button>
//       </div>

//       <InteractionModal
//         data={interaction}
//         onClose={() => setInteraction(null)}
//       />

//       {gameOver && (
//         <div className='modal-overlay'>
//           <div className='modal-box'>
//             <p className='modal-text'>
//               Your strength has failed you. The Fractured Worlds claim another.
//             </p>
//             <div className='modal-choices'>
//               <button className='modal-btn' onClick={handleNewGame}>
//                 New Game
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }