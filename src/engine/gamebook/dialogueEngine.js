import { evaluateCondition } from './conditions'
import { applyEffects } from './effects'
import { resolveEntryNode } from './questMapper'

function resolveText(text, state) {
  return typeof text === 'function' ? text(state) : text
}

function visibleChoices(node, state) {
  return (node.choices || []).filter(choice => evaluateCondition(choice.condition, state))
}

function buildView(tree, nodeId, state) {
  const node = tree.nodes[nodeId]
  if (!node) {
    console.warn(`Dialogue tree "${tree.id}" has no node "${nodeId}"`)
    return null
  }

  const choices = visibleChoices(node, state)

  return {
    treeId: tree.id,
    nodeId,
    speaker: node.speaker || null,
    text: resolveText(node.text, state),
    choices: choices.map((choice, idx) => ({
      idx,
      text: resolveText(choice.text, state)
    })),
    isEnd: choices.length === 0
  }
}

export function startDialogue(tree, state) {
  const nodeId = resolveEntryNode(tree, state, evaluateCondition)
  return {
    view: buildView(tree, nodeId, state), state
  }
}

export function chooseDialogueOption(tree, state, nodeId, choiceIdx) {
  const node = tree.nodes[nodeId]
  if (!node) return {
    view: null, state, isEnd: true
  }

  const choice = visibleChoices(node, state)[choiceIdx]
  if (!choice) return {
    view: buildView(tree, nodeId, state), state, isEnd: false
  }

  const nextState = applyEffects(state, choice.effects)
  const view = buildView(tree, choice.next, nextState)

  return {
    view, state: nextState, isEnd: !view || view.isEnd
  }
}
