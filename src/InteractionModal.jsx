export default function InteractionModal({ data, onClose }) {
  if (!data) return null

  return (
    <div className='modal-overlay'>
      <div className='modal-box'>
        <div className='modal-text'>
          {data.text}
        </div>

        {data.type === 'dialogue' && (
          <button
            className='modal-btn'
            onClick={onClose}
          >
            Continue
          </button>
        )}

        {data.type === 'choices' && (
          <div className='modal-choices'>
            {data.choices.map((c, i) => (
              <button
                key={i}
                className='modal-btn'
                onClick={c.action}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
