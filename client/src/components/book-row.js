import React from 'react'
import { Link } from 'react-router-dom'
import { useListItem } from '../utils/list-items'
import { StatusButtons } from './status-buttons'
import { Rating } from './rating'

function BookRow({ book }) {
  const { title, author, coverImageUrl } = book
  const listItem = useListItem(book.id)

  const id = `book-row-book-${book.id}`

  return (
    <div>
      <Link aria-labelledby={id} to={`/book/${book.id}`}>
        <div>
          <img src={coverImageUrl} alt={`${title} book cover`} />
        </div>
        <div>
          <div>
            <div>
              <h2 id={id}>{title}</h2>
              {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
            </div>
            <div>
              <div>{author}</div>
              <small>{book.publisher}</small>
            </div>
          </div>
          <small>{book.synopsis.substring(0, 500)}...</small>
        </div>
      </Link>
      <div>
        <StatusButtons book={book} />
      </div>
    </div>
  )
}

export { BookRow }
