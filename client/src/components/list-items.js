import { useListItems } from '../cache/list-items'
import ListTable from './tables/table'

function ListItems({
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

  return <ListTable data={filterListItems} />
}

export default ListItems
