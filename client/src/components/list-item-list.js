import { useListItems } from '../cache/list-item-crud'
import { BookRow } from './book-row'

function ListItemList({
  queryKey,
  filterListItems,
  noListItems,
  noFilteredListItems,
}) {
  const listItems = useListItems({ queryKey })

  const filteredListItems = listItems.filter(filterListItems)

  if (!listItems.length) {
    return <div>{noListItems}</div>
  }

  if (!filteredListItems.length) {
    return <div>{noFilteredListItems}</div>
  }

  return (
    <ul>
      {filteredListItems.map(listItem => (
        <li key={listItem.id} aria-label={listItem.book.title}>
          <BookRow book={listItem.book} />
        </li>
      ))}
    </ul>
  )
}

export { ListItemList }
