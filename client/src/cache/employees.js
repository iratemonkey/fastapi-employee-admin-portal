import { useQuery, useMutation, queryCache } from 'react-query'
import { setQueryDataForBook } from './books'
import api from '../api'

function useEmployee(employeeId, options) {
  const employees = useEmployees(options)
  return employees?.find(li => li.employeeId === employeeId) ?? null
}

function useEmployees({ onSuccess, ...options } = {}) {
  const { data: employees } = useQuery({
    queryKey: 'employees',
    queryFn: () =>
      api.employee.find().then(data => {
        console.log('data', data)
        return data
      }),
    onSuccess: async employees => {
      await onSuccess?.(employees)
      for (const employee of employees) {
        setQueryDataForBook(employee.first_name)
      }
    },
    ...options,
  })
  return employees ?? []
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('employees'),
}

function onUpdateMutation(newItem) {
  const previousItems = queryCache.getQueryData('employees')

  queryCache.setQueryData('employees', old => {
    return old.map(item => {
      return item.id === newItem.id ? { ...item, ...newItem } : item
    })
  })

  return () => queryCache.setQueryData('employees', previousItems)
}

function useUpdateEmployee(options) {
  return useMutation(
    updates =>
      api.employee.update(updates.id, {
        data: updates,
      }),
    {
      onMutate: onUpdateMutation,
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function useDeleteEmployee(options) {
  return useMutation(({ id }) => api.employee.delete(id), {
    onMutate: removedItem => {
      const previousItems = queryCache.getQueryData('employees')

      queryCache.setQueryData('employees', old => {
        return old.filter(item => item.id !== removedItem.id)
      })

      return () => queryCache.setQueryData('employees', previousItems)
    },
    ...defaultMutationOptions,
    ...options,
  })
}

function useCreateEmployee(options) {
  return useMutation(
    ({ employeeId }) => api.employee('employees', { data: { employeeId } }),
    {
      ...defaultMutationOptions,
      ...options,
    },
  )
}

export {
  useEmployee,
  useEmployees,
  useUpdateEmployee,
  useDeleteEmployee,
  useCreateEmployee,
}
