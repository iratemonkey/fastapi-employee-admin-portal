import * as React from 'react'
import { useQuery, queryCache } from 'react-query'
import { useApi } from '../contexts/auth-context'
import bookPlaceholderSvg from '../assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({ length: 10 }, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const bookQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
}

const getBookSearchConfig = (api, query) => ({
  queryKey: ['bookSearch', { query }],
  queryFn: () =>
    api(`books?query=${encodeURIComponent(query)}`).then(data => data.books),
  config: {
    onSuccess(books) {
      for (const book of books) {
        queryCache.setQueryData(
          ['book', { bookId: book.id }],
          book,
          bookQueryConfig,
        )
      }
    },
  },
})

function useBookSearch(query) {
  const api = useApi()
  const result = useQuery(getBookSearchConfig(api, query))
  return { ...result, books: result.data ?? loadingBooks }
}

function useBook(bookId) {
  const api = useApi()
  const { data } = useQuery({
    queryKey: ['book', { bookId }],
    queryFn: () => api(`books/${bookId}`).then(data => data.book),
    ...bookQueryConfig,
  })
  return data ?? loadingBook
}

function useRefetchBookSearchQuery() {
  const api = useApi()
  return React.useCallback(
    async function refetchBookSearchQuery() {
      queryCache.removeQueries('bookSearch')
      await queryCache.prefetchQuery(getBookSearchConfig(api, ''))
    },
    [api],
  )
}

function setQueryDataForBook(book) {
  queryCache.setQueryData({
    queryKey: ['book', { bookId: book.id }],
    queryFn: book,
    ...bookQueryConfig,
  })
}

export {
  useBook,
  useBookSearch,
  useRefetchBookSearchQuery,
  setQueryDataForBook,
}
