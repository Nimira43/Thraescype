export default function NPC({ npc }) {
  if (!npc) return null

  return (
    <div className='npc-box'>
      <div className='npc-name'>
        {npc.name}
      </div>

      <div className='npc-dialogue-preview'>
        {npc.dialogue?.[0] || '…'}
      </div>

      {npc.questId && (
        <div className='npc-quest'>
          Quest giver: {npc.questId}
        </div>
      )}
    </div>
  )
}
