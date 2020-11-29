import React from 'react'
import { Container } from 'react-bootstrap'
import { Error } from '../../components/errors'

function ErrorScreen({ error, onClose }) {
  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Error error={error} onClose={onClose} />
    </Container>
  )
}

export default ErrorScreen
