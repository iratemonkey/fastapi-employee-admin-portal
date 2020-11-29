import React from 'react'
import { useParams } from 'react-router-dom'
import { useEmployee } from '../../cache/employees'
import { Container, Row, Col } from 'react-bootstrap'
import { capitalize } from '../../utils/string'

function EmployeeScreen() {
  const { employeeId } = useParams()
  const employee = useEmployee(employeeId, 'employees')

  const { first_name, last_name, email, image_url } = employee
  const fullName = `${capitalize(first_name)} ${capitalize(last_name)}`

  return (
    <Container className="p-5">
      <Row>
        <Col>
          <div
            style={{ width: '200px', height: '200px' }}
            className="rounded-circle overflow-hidden"
          >
            <img
              className="h-100"
              src={image_url || 'holder.js/171x180'}
              alt={`${fullName}`}
            />
          </div>
        </Col>
        <Col>
          <h1>{fullName}</h1>
          <b>Email:</b>
          <i> {email}</i>
          <p>{'Im a super special employee!'}</p>
        </Col>
      </Row>
    </Container>
  )
}

export default EmployeeScreen
