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

export function resolveEntryNode(tree, state, evaluateCondition) {
  if (tree.entryPoints) {
    const match = tree.entryPoints.find(ep => evaluateCondition(ep.condition, state))
    if (match) return match.node
  }
  return tree.startNode
}
