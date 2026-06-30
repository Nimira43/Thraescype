import { DIALOGUE_TREES } from './dialogTrees'

export function startDialogue(treeId) {
  const tree = DIALOGUE_TREES[treeId]
  if (!tree) return null

  const node = tree.nodes[tree.startNode]
  return {
    treeId,
    nodeId: tree.startNode,
    node
  }
}

export function advanceDialogue(state, choiceIndex) {
  const tree = DIALOGUE_TREES[state.treeId]
  if (!tree) return state

  const currentNode = tree.nodes[state.nodeId]
  const choice = currentNode.choices[choiceIndex]
  if (!choice) return state

  const nextNodeId = choice.next
  const nextNode = tree.nodes[nextNodeId]

  return {
    treeId: state.treeId,
    nodeId: nextNodeId,
    node: nextNode,
    effect: choice.effect || null
  }
}
