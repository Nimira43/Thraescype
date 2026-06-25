// gamebookEngine/questMapper.js
//
// Quest definitions, plus the link between "what stage is this quest at" and
// "which dialogue node should this NPC open with". This is the actual
// gamebook-routing piece — re-visiting the same NPC gives a different
// paragraph depending on how far you've got, same as "turn to 67 if you have
// the key" in a Fighting Fantasy book.
//
// Quest shape:
//
//   {
//     id: 'lost_relic',
//     name: 'The Lost Relic',
//     startStage: 'started',
//     stageOrder: ['started', 'relic_found', 'completed'],   // ordinal — used for "at least" checks
//     stages: {
//       started:     { description: 'Find the relic, said to rest in the marsh.' },
//       relic_found: { description: 'Return the relic to Eadric.' },
//       completed:   { description: 'The relic rests with Eadric once more.' }
//     }
//   }
//
// You don't have to call registerQuest yourself if you don't want a global
// registry — every function below also works if you just pass the quest
// object in directly. The registry is there so conditions/effects (which
// only get given a questId) can look quests up by id.

export const QUESTS = {}

export function registerQuest(quest) {
  QUESTS[quest.id] = quest
}

export function registerQuests(quests) {
  quests.forEach(registerQuest)
}

export function getQuest(questId) {
  return QUESTS[questId] || null
}

export function isStageAtLeast(questId, currentStage, targetStage) {
  const quest = QUESTS[questId]
  if (!quest || currentStage == null) return false
  const currentIdx = quest.stageOrder.indexOf(currentStage)
  const targetIdx = quest.stageOrder.indexOf(targetStage)
  if (currentIdx === -1 || targetIdx === -1) return false
  return currentIdx >= targetIdx
}

// --- Dialogue entry-point routing -----------------------------------------
//
// A dialogue tree can declare multiple possible opening nodes, each gated by
// a condition, checked top to bottom — first match wins. Falls back to
// tree.startNode if nothing matches (or none are declared).
//
//   tree.entryPoints = [
//     { condition: { type: 'questStage', questId: 'lost_relic', is: 'relic_found' }, node: 'relic_returned' },
//     { condition: { type: 'questActive', questId: 'lost_relic' }, node: 'still_looking' },
//   ]
//
// `evaluateCondition` is passed in rather than imported, to avoid a circular
// import with conditions.js (which itself needs isStageAtLeast from here).

export function resolveEntryNode(tree, state, evaluateCondition) {
  if (tree.entryPoints) {
    const match = tree.entryPoints.find(ep => evaluateCondition(ep.condition, state))
    if (match) return match.node
  }
  return tree.startNode
}
