import Item from '../../components/Item'

export default function InteractionModal({ data, onClose }) {
  if (!data) return null

  if (data.type === 'dialogue') {
    const { state } = data
    const { node } = state

    return (
      <div className='modal-overlay'>
        <div className='modal-box'>
          <p className='modal-text'>{node.text}</p>
          <div className='modal-choices'>
            {node.choices.map((choice, idx) => (
              <button
                key={idx}
                className='modal-btn'
                onClick={() => data.onChoice(idx)}
              >
                {choice.text}
              </button>
            ))}
            {node.choices.length === 0 && (
              <button
                className='modal-btn'
                onClick={onClose}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (data.type === 'item') {
    return (
      <div className='modal-overlay'>
        <div className='modal-box'>
          <Item item={data.item} />
          <div className='modal-choices'>
            {data.choices.map((choice, idx) => (
              <button
                key={idx}
                className='modal-btn'
                onClick={choice.action}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}
