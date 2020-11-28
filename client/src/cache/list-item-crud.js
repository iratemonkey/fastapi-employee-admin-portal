import { useQuery, useMutation, queryCache } from 'react-query'
import { setQueryDataForBook } from '../utils/books'
import api from '../api'

function useListItem(queryKey, id, options) {
  const listItems = useListItems(queryKey, options)
  return listItems?.find(li => li.id === id) ?? null
}

function useListItems({ queryKey, onSuccess, ...options } = {}) {
  const { data: listItems } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      api[queryKey].find().then(data => {
        console.log('data', data)
        return data.listItems
      }),
    onSuccess: async listItems => {
      await onSuccess?.(listItems)
      for (const listItem of listItems) {
        setQueryDataForBook(listItem.first_name)
      }
    },
    ...options,
  })

  console.log('listItems', listItems)
  return listItems ?? []
}

function getDefaultMutationOptions(queryKey) {
  return {
    onError: (err, variables, recover) =>
      typeof recover === 'function' ? recover() : null,
    onSettled: () => queryCache.invalidateQueries(queryKey),
  }
}

function onUpdateMutation(queryKey, newItem) {
  const previousItems = queryCache.getQueryData(queryKey)

  queryCache.setQueryData(queryKey, old => {
    return old.map(item => {
      return item.id === newItem.id ? { ...item, ...newItem } : item
    })
  })

  return () => queryCache.setQueryData(queryKey, previousItems)
}

function useUpdateListItem(queryKey, options) {
  return useMutation(
    updates =>
      api[queryKey].update(updates.id, {
        data: updates,
      }),
    {
      onMutate: onUpdateMutation,
      ...getDefaultMutationOptions(queryKey),
      ...options,
    },
  )
}

function useDeleteListItem(queryKey, options) {
  return useMutation(({ id }) => api[queryKey].delete(id), {
    onMutate: removedItem => {
      const previousItems = queryCache.getQueryData(queryKey)

      queryCache.setQueryData(queryKey, old => {
        return old.filter(item => item.id !== removedItem.id)
      })

      return () => queryCache.setQueryData(queryKey, previousItems)
    },
    ...getDefaultMutationOptions(queryKey),
    ...options,
  })
}

function useCreateListItem(queryKey, options) {
  return useMutation(
    ({ id }) => api[queryKey].create(queryKey, { data: { id } }),
    {
      ...getDefaultMutationOptions(queryKey),
      ...options,
    },
  )
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useDeleteListItem,
  useCreateListItem,
}
