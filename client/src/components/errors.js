import React from 'react'
import { Alert, Container } from 'react-bootstrap'

function Error({ error, onClose }) {
  return (
    <Alert variant="danger" onClose={onClose} dismissible>
      <Alert.Heading>{error?.status || 400}</Alert.Heading>
      <p>
        {error?.data?.detail ||
          "Uh oh... There's a problem. Try refreshing the app."}
      </p>
    </Alert>
  )
}

function FallbackError({ error, onClose }) {
  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Error erro={error} onClose={onClose} />
    </Container>
  )
}

export { Error, FallbackError }
