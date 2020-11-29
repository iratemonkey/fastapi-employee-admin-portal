import React from 'react'
import {
  Container,
  Row,
  Col,
  Jumbotron,
  Button,
  Spinner,
  Form,
  FormControl,
  Card,
} from 'react-bootstrap'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { useSearch, useRefetchEmployeeSearchQuery } from '../../cache/employees'
import ListTable from '../../components/tables/table'

function EmployeesScreen() {
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState()
  const { employees, error, isLoading, isError, isSuccess } = useSearch(
    'employees',
    query,
  )
  const refetchEmployeeSearchQuery = useRefetchEmployeeSearchQuery()

  React.useEffect(() => {
    return () => refetchEmployeeSearchQuery()
  }, [refetchEmployeeSearchQuery])

  function handleSearchClick(event) {
    event.preventDefault()
    setQueried(true)
    setQuery(event.target.elements.search.value)
  }

  function giveFeedBack() {
    return queried ? null : (
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : isSuccess && employees.length ? (
          <p>Here you go! Find more employees with the search bar above.</p>
        ) : isSuccess && !employees.length ? (
          <p>
            Hmmm... I couldn't find any employees to suggest for you. Sorry.
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <Container className="p-5" fluid>
      <Row>
        <Col>
          <Jumbotron variant="primary">
            <h1>Employees</h1>
            <p>Search for employees by name.</p>
            <Form onSubmit={handleSearchClick} inline>
              <FormControl
                id="search"
                type="text"
                placeholder="Search employees..."
                className="mr-sm-2"
              />
              <Button variant="outline-success" type="submit">
                {isLoading ? (
                  <Spinner
                    animation="border"
                    variant="outline-success"
                    role="status"
                    size="sm"
                  />
                ) : isError ? (
                  <FaTimes aria-label="error" />
                ) : (
                  <FaSearch aria-label="search" />
                )}
              </Button>
            </Form>
          </Jumbotron>
        </Col>
      </Row>
      <div>
        {isError ? (
          <div>
            <p>There was an error:</p>
            <pre>{error.message}</pre>
          </div>
        ) : null}
      </div>
      <div>
        {giveFeedBack()}
        {employees.length ? (
          <ListTable data={employees} />
        ) : queried ? (
          <div>
            {isLoading ? (
              <div>
                <Card className="vh-100 d-flex justify-content-center align-items-center">
                  <Spinner
                    animation="border"
                    variant="primary"
                    role="status"
                    size="xl"
                  />
                </Card>
              </div>
            ) : (
              <p>
                Hmmm... I couldn't find any employees with the query "{query}."
                Please try another.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </Container>
  )
}

export default EmployeesScreen
