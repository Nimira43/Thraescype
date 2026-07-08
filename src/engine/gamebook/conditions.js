import { hasFlag, hasItem, getQuestStage } from './state'
import { isStageAtLeast } from './questMapper'

export function evaluateCondition(condition, state) {
  if (!condition) return true
  if (typeof condition === 'function') return Boolean(condition(state))

  switch (condition.type) {
    case 'flag':
      return hasFlag(state, condition.key) === (condition.equals ?? true)

    case 'hasItem':
      return hasItem(state, condition.itemId)

    case 'questActive':
      return getQuestStage(state, condition.questId) !== null

    case 'questStage':
      return getQuestStage(state, condition.questId) === condition.is

    case 'questStageAtLeast':
      return isStageAtLeast(condition.questId, getQuestStage(state, condition.questId), condition.stage)

    case 'and':
      return condition.conditions.every(c => evaluateCondition(c, state))

    case 'or':
      return condition.conditions.some(c => evaluateCondition(c, state))

    case 'not':
      return !evaluateCondition(condition.condition, state)

    default:
      console.warn(`evaluateCondition: unknown condition type "${condition.type}"`)
      return true
  }
}
