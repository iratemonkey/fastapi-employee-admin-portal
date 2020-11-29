import React from 'react'
import debounceFn from 'debounce-fn'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useBook } from '../utils/books'
import { formatDate } from '../utils/misc'
import { useListItem, useUpdateListItem } from '../cache/list-items'
import { Spinner, ErrorMessage } from '../components/lib'
import { Rating } from '../components/rating'
// import { StatusButtons } from '../components/status-buttons'

function BookScreen() {
  const { bookId } = useParams()
  const book = useBook(bookId)
  const listItem = useListItem(bookId)

  const { title, author, coverImageUrl, publisher, synopsis } = book

  return (
    <div>
      <div>
        <img src={coverImageUrl} alt={`${title} book cover`} />
        <div>
          <div>
            <div>
              <h1>{title}</h1>
              <div>
                <i>{author}</i>
                <span>|</span>
                <i>{publisher}</i>
              </div>
            </div>
            {/* <div>{book.loadingBook ? null : <StatusButtons book={book} />}</div> */}
          </div>
          <div>
            {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
            {listItem ? <ListItemTimeframe listItem={listItem} /> : null}
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
      {!book.loadingBook && listItem ? <textarea listItem={listItem} /> : null}
    </div>
  )
}

function ListItemTimeframe({ listItem }) {
  const timeframeLabel = listItem.finishDate
    ? 'Start and finish date'
    : 'Start date'

  return (
    <div label={timeframeLabel}>
      <div aria-label={timeframeLabel}>
        <FaRegCalendarAlt />
        <span>
          {formatDate(listItem.startDate)}{' '}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </div>
  )
}

function NotesTextarea({ listItem }) {
  const [mutate, { error, isError, isLoading }] = useUpdateListItem()

  const debouncedMutate = React.useMemo(
    () => debounceFn(mutate, { wait: 300 }),
    [mutate],
  )

  function handleNotesChange(e) {
    debouncedMutate({ id: listItem.id, notes: e.target.value })
  }

  return (
    <React.Fragment>
      <div>
        <label htmlFor="notes">Notes</label>
        {isError ? <ErrorMessage variant="inline" error={error} /> : null}
        {isLoading ? <Spinner /> : null}
      </div>
      <textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
      />
    </React.Fragment>
  )
}

export { BookScreen }
