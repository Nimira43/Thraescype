// gamebookEngine/dialogueEngine.js
//
// The reusable dialogue handler itself. It knows nothing about React and
// nothing about Game.jsx — feed it a tree + gamebook state, it hands
// back a "view" (what to render) and lets you apply a choice to get the
// next view + the next state.
//
// Tree shape:
//
//   {
//     id: 'old_man_intro',
//     startNode: 'greeting',
//     entryPoints: [ ... ],             // optional — see questMapper.js
//     nodes: {
//       greeting: {
//         speaker: 'Eadric the Withered',          // optional
//         text: '...' | (state) => '...',
//         choices: [
//           {
//             text: '...' | (state) => '...',
//             next: 'explain_fracture',
//             condition: <declarative condition>,   // optional — hide choice if false
//             effects: [ <declarative effect>, ... ] // optional
//           }
//         ]
//       }
//     }
//   }
//
// Usage (once this is wired in):
//
//   import { startDialogue, chooseDialogueOption } from './gamebookEngine'
//
//   const { view, state } = startDialogue(tree, playerState)
//   // ...render view.text + view.choices...
//   const result = chooseDialogueOption(tree, state, view.nodeId, choiceIdx)
//   // result.view  -> next thing to render (or null if tree ended)
//   // result.state -> new player state, save this back
//   // result.isEnd -> true when there are no more choices

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

// Begin a conversation. Picks the right opening node via questMapper's
// entryPoints (e.g. different greeting if a quest is already underway).
export function startDialogue(tree, state) {
  const nodeId = resolveEntryNode(tree, state, evaluateCondition)
  return {
    view: buildView(tree, nodeId, state), state
  }
}

// Apply a choice made on `nodeId`. `choiceIdx` is the index into the VISIBLE
// choice list you were handed in `view.choices` — not the raw node.choices
// array, since some choices may be hidden by conditions.
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
