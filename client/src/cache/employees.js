import * as React from 'react'
import { useQuery, queryCache } from 'react-query'
import { useApi } from '../contexts/auth-context'

const loadingEmployee = {
  email: 'Loading...',
  first_name: 'Loading...',
  last_name: 'Loading...',
  employee_id: 'Loading...',
  is_active: 'Loading...',
  loadingEmployee: true,
}

// TODO come back to this and show a better loading component
const loadingEmployees = Array.from({ length: 1 }, (v, index) => ({
  id: `loading-employee-${index}`,
  ...loadingEmployee,
}))

const employeeQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
}

const getSearchConfig = (api, endpoint, query) => ({
  queryKey: ['employeeSearch', { query }],
  queryFn: () =>
    api(endpoint)
      .find(query)
      .then(data => data),
  config: {
    onSuccess(employees) {
      for (const employee of employees) {
        queryCache.setQueryData(
          ['employees', { employeeId: employee.id }],
          employee,
          employeeQueryConfig,
        )
      }
    },
  },
})

function useSearch(endpoint, query) {
  const api = useApi()
  const searchConfig = getSearchConfig(api, endpoint, query)

  const result = useQuery(searchConfig)
  return { ...result, employees: result.data ?? loadingEmployees }
}

function useEmployee(employeeId, queryKey) {
  const api = useApi()
  const { data } = useQuery({
    queryKey: ['employees', { employeeId }],
    queryFn: () =>
      api(queryKey)
        .findById(employeeId)
        .then(data => data),
    ...employeeQueryConfig,
  })
  return data ?? loadingEmployee
}

function useRefetchEmployeeSearchQuery() {
  const api = useApi()
  return React.useCallback(
    async function refetchBookSearchQuery() {
      queryCache.removeQueries('bookSearch')
      await queryCache.prefetchQuery(getSearchConfig(api, ''))
    },
    [api],
  )
}

function setQueryDataForEmployee(employee) {
  queryCache.setQueryData({
    queryKey: ['employee', { employeeId: employee.id }],
    queryFn: employee,
    ...employeeQueryConfig,
  })
}

export {
  useEmployee,
  useSearch,
  useRefetchEmployeeSearchQuery,
  setQueryDataForEmployee,
}
