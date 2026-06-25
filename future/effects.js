// gamebookEngine/effects.js
//
// Effects are the consequences of a choice. applyEffect always returns a NEW
// state object — the one passed in is never mutated, consistent with how
// Game.jsx already treats its state.
//
// Supported types:
//
//   { type: 'setFlag', key, value = true }
//   { type: 'giveItem', itemId }
//   { type: 'removeItem', itemId }
//   { type: 'startQuest', questId, stage }    -> stage defaults to the quest's startStage
//   { type: 'setQuestStage', questId, stage }
//   { type: 'completeQuest', questId }        -> shorthand: jumps to the quest's final stage
//
// Escape hatch: an effect can also be a function, called as
// effect(state) -> newState.

import { QUESTS } from './questMapper'

export function applyEffect(state, effect) {
  if (!effect) return state
  if (typeof effect === 'function') return effect(state)

  switch (effect.type) {
    case 'setFlag':
      return {
        ...state,
        flags: { ...state.flags, [effect.key]: effect.value ?? true }
      }

    case 'giveItem':
      if (state.inventory.includes(effect.itemId)) return state
      return {
        ...state, inventory: [...state.inventory, effect.itemId]
      }

    case 'removeItem':
      return {
        ...state, inventory: state.inventory.filter(id => id !== effect.itemId)
      }

    case 'startQuest': {
      const quest = QUESTS[effect.questId]
      const stage = effect.stage || quest?.startStage
      return {
        ...state, quests: { ...state.quests, [effect.questId]: stage }
      }
    }

    case 'setQuestStage':
      return {
        ...state, quests: { ...state.quests, [effect.questId]: effect.stage }
      }

    case 'completeQuest': {
      const quest = QUESTS[effect.questId]
      const finalStage = quest?.stageOrder?.[quest.stageOrder.length - 1]
      return {
        ...state, quests: { ...state.quests, [effect.questId]: finalStage }
      }
    }

    default:
      console.warn(`applyEffect: unknown effect type "${effect.type}"`)
      return state
  }
}

export function applyEffects(state, effects = []) {
  return effects.reduce((s, effect) => applyEffect(s, effect), state)
}
