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
