import React from 'react'
import { Spinner } from 'react-bootstrap'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { useSearch, useRefetchEmployeeSearchQuery } from '../../cache/employees'
// import TableRow from '../../components/tables/table-row'

function EmployeeScreen() {
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState()
  const { employees, error, isLoading, isError, isSuccess } = useSearch(query)
  const refetchEmployeeSearchQuery = useRefetchEmployeeSearchQuery()

  React.useEffect(() => {
    return () => refetchEmployeeSearchQuery()
  }, [refetchEmployeeSearchQuery])

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
            ) : isSuccess && employees.length ? (
              <p>Here you go! Find more employees with the search bar above.</p>
            ) : isSuccess && !employees.length ? (
              <p>
                Hmmm... I couldn't find any books to suggest for you. Sorry.
              </p>
            ) : null}
          </div>
        )}
        {employees.length ? (
          <ul>
            {employees.map(employee => (
              <li key={employee.id} aria-label={employee.first_name}>
                <span>{employee.first_name}</span>
                {/* <TableRow key={employee.id} employee={employee} /> */}
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

export default EmployeeScreen
