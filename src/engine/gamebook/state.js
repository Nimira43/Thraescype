// The "save file" shape for the dialogue/quest system. Deliberately plain
// data — no classes, no functions stored on it — so it drops straight into
// the existing storage.js (JSON.stringify/parse) and into player state.
//
//   {
//     flags:     { [flagKey]: true | false | any },
//     quests:    { [questId]: stageId },
//     inventory: [itemId, itemId, ...]
//   }
//

export function createGamebookState(overrides = {}) {
  return {
    flags: {},
    quests: {},
    inventory: [],
    ...overrides
  }
}

export function hasFlag(state, key) {
  return Boolean(state.flags[key])
}

export function getFlag(state, key) {
  return state.flags[key]
}

export function hasItem(state, itemId) {
  return state.inventory.includes(itemId)
}

export function getQuestStage(state, questId) {
  return state.quests[questId] ?? null
}

export function isQuestActive(state, questId) {
  return getQuestStage(state, questId) !== null
}

export function isQuestAtStage(state, questId, stageId) {
  return getQuestStage(state, questId) === stageId
}
