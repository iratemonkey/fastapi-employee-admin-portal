import React from 'react'
import { Link } from 'react-router-dom'
// import { StatusButtons } from '../status-buttons'

function TableRow({ book }) {
  const { title, author, coverImageUrl } = book

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
              <div>{author}</div>
              <small>{book.publisher}</small>
            </div>
          </div>
          <small>{book.synopsis.substring(0, 500)}...</small>
        </div>
      </Link>
      <div>{/* <StatusButtons book={book} /> */}</div>
    </div>
  )
}

export default TableRow
