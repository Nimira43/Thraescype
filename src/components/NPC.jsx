import { DIALOGUE_TREES } from '../data/dialog/dialogTrees'

export default function NPC({ npc }) {
  if (!npc) return null

  let preview = '…'

  if (npc.dialogueTreeId && DIALOGUE_TREES[npc.dialogueTreeId]) {
    const tree = DIALOGUE_TREES[npc.dialogueTreeId]
    const startNode = tree.nodes[tree.startNode]
    if (startNode?.text) {
      preview = startNode.text
    }
  }

  return (
    <div className='npc-box'>
      <div className='npc-name'>
        {npc.name}
      </div>

      <div className='npc-dialogue-preview'>
        {preview}
      </div>

      {npc.questId && (
        <div className='npc-quest'>
          Quest giver: {npc.questId}
        </div>
      )}
    </div>
  )
}
