import React from 'react'
import { useUpdateListItem } from '../utils/list-items'
import { FaStar } from 'react-icons/fa'
import { ErrorMessage } from '../components/lib'

function Rating({ listItem }) {
  const [isTabbing, setIsTabbing] = React.useState(false)

  const [mutate, { error, isError }] = useUpdateListItem()

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Tab') {
        setIsTabbing(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown, { once: true })
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const rootClassName = `list-item-${listItem.id}`

  const stars = Array.from({ length: 5 }).map((x, i) => {
    const ratingId = `rating-${listItem.id}-${i}`
    const ratingValue = i + 1
    return (
      <React.Fragment key={i}>
        <input
          name={rootClassName}
          type="radio"
          id={ratingId}
          value={ratingValue}
          checked={ratingValue === listItem.rating}
          onChange={() => {
            mutate({ id: listItem.id, rating: ratingValue })
          }}
        />
        <label htmlFor={ratingId}>
          <span>
            {ratingValue} {ratingValue === 1 ? 'star' : 'stars'}
          </span>
          <FaStar />
        </label>
      </React.Fragment>
    )
  })
  return (
    <div onClick={e => e.stopPropagation()} className={rootClassName}>
      <span>{stars}</span>
      {isError ? <ErrorMessage error={error} /> : null}
    </div>
  )
}

export { Rating }
