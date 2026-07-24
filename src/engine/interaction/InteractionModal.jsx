import Item from '../../components/Item'
import { ITEMS } from '../../data/entities/items'

export default function InteractionModal({ data, onClose }) {
  if (!data) return null

  if (data.type === 'dialogue') {
    const { view } = data

    return (
      <div className='modal-overlay'>
        <div className='modal-box'>
          {view.speaker && <div className='modal-speaker'>{view.speaker}</div>}
          <p className='modal-text'>
            {view.text}
          </p>
          <div className='modal-choices'>
            {view.choices.map((choice) => (
              <button
                key={choice.idx}
                className='modal-btn'
                onClick={() => data.onChoice(choice.idx)}
              >
                {choice.text}
              </button>
            ))}
            {view.isEnd && (
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
          {data.overweight && (
            <p className='modal-warning'>
              Too heavy to carry.
            </p>
          )}
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

  if (data.type === 'inventory') {
    return (
      <div className='modal-overlay'>
        <div className='modal-box'>
          <p className='modal-text'>
            Inventory
          </p>

          {data.items.length === 0 && (
            <p className='inventory-empty'>
              Nothing carried.
            </p>
          )}

          <div className='modal-choices modal-choices-scroll'>
            {data.items.map((itemId, idx) => (
              <button
                key={`${itemId}-${idx}`}
                className='modal-btn'
                onClick={() => data.onSelect(itemId, idx)}
              >
                {ITEMS[itemId]?.name || itemId}
              </button>
            ))}
          </div>

          <button
            className='modal-btn modal-btn-close'
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return null
}

