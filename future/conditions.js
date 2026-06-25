// gamebookEngine/conditions.js
//
// Declarative conditions so the story content can stay as plain data
// (readable, diffable, eventually JSON-able) instead of scattering one-off
// JS predicates through every dialogue tree.
//
// A condition is { type: '...', ...params }. Combine with and / or / not.
// If omitted entirely, a condition is treated as always-true.
//
// Supported types:
//
//   { type: 'flag', key, equals = true }
//   { type: 'hasItem', itemId }
//   { type: 'questActive', questId }
//   { type: 'questStage', questId, is }                    -> exact stage match
//   { type: 'questStageAtLeast', questId, stage }          -> uses quest.stageOrder
//   { type: 'and', conditions: [...] }
//   { type: 'or',  conditions: [...] }
//   { type: 'not', condition }
//
// Escape hatch: a condition can also just be a function, called as
// condition(state) -> boolean, for anything too fiddly to express
// declaratively. Use sparingly — declarative conditions are what keep the
// story content portable/serialisable.

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
