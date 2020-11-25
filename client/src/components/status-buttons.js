import React from 'react'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
} from 'react-icons/fa'
import {
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
} from '../utils/list-items'

function StatusButtons({ book }) {
  const listItem = useListItem(book.id)

  const [mutate] = useUpdateListItem({ throwOnError: true })
  const [handleRemoveClick] = useRemoveListItem({ throwOnError: true })
  const [handleAddClick] = useCreateListItem({ throwOnError: true })

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <button
            label="Mark as unread"
            onClick={() => mutate({ id: listItem.id, finishDate: null })}
            icon={<FaBook />}
          />
        ) : (
          <button
            label="Mark as read"
            onClick={() => mutate({ id: listItem.id, finishDate: Date.now() })}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <button
          label="Remove from list"
          onClick={() => handleRemoveClick({ id: listItem.id })}
          icon={<FaMinusCircle />}
        />
      ) : (
        <button
          label="Add to list"
          onClick={() => handleAddClick({ bookId: book.id })}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}

export { StatusButtons }
