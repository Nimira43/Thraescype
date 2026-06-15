export default function Item({ item }) {
  if (!item) return null

  return (
    <div className='item-box'>
      <div className='item-name'>
        {item.name}
      </div>
      <div className='item-description'>
        {item.description}
      </div>
    </div>
  )
}
