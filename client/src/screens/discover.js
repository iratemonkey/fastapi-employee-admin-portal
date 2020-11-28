import React from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { useBookSearch, useRefetchBookSearchQuery } from '../utils/books'
import { BookRow } from '../components/book-row'
import { Spinner } from '../components/lib'
import { Profiler } from '../components/profiler'

function DiscoverBooksScreen() {
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState()
  const { books, error, isLoading, isError, isSuccess } = useBookSearch(query)
  const refetchBookSearchQuery = useRefetchBookSearchQuery()

  React.useEffect(() => {
    return () => refetchBookSearchQuery()
  }, [refetchBookSearchQuery])

  function handleSearchClick(event) {
    event.preventDefault()
    setQueried(true)
    setQuery(event.target.elements.search.value)
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSearchClick}>
          <input placeholder="Search books..." id="search" type="search" />
          <div label="Search Books">
            <label htmlFor="search">
              <button type="submit">
                {isLoading ? (
                  <Spinner />
                ) : isError ? (
                  <FaTimes aria-label="error" />
                ) : (
                  <FaSearch aria-label="search" />
                )}
              </button>
            </label>
          </div>
        </form>

        {isError ? (
          <div>
            <p>There was an error:</p>
            <pre>{error.message}</pre>
          </div>
        ) : null}
      </div>
      <div>
        {queried ? null : (
          <div css={{ marginTop: 20, fontSize: '1.2em', textAlign: 'center' }}>
            <p>Welcome to the discover page.</p>
            <p>Here, let me load a few books for you...</p>
            {isLoading ? (
              <div css={{ width: '100%', margin: 'auto' }}>
                <Spinner />
              </div>
            ) : isSuccess && books.length ? (
              <p>Here you go! Find more books with the search bar above.</p>
            ) : isSuccess && !books.length ? (
              <p>
                Hmmm... I couldn't find any books to suggest for you. Sorry.
              </p>
            ) : null}
          </div>
        )}
        {books.length ? (
          <ul css={{ marginTop: 20 }}>
            {books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </ul>
        ) : queried ? (
          <div>
            {isLoading ? (
              <div>
                <Spinner />
              </div>
            ) : (
              <p>
                Hmmm... I couldn't find any books with the query "{query}."
                Please try another.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { DiscoverBooksScreen }
