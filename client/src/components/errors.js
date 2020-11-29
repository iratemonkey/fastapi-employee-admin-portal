import React, { useState } from 'react'
import { Alert, Container } from 'react-bootstrap'

function getErrorMessage(error) {
  let status = 400
  let detail = "Uh oh... There's a problem. Try refreshing the app."

  if (error?.response) {
    status = error.response?.status
    detail = error.response?.data?.detail
  } else if (error?.data) {
    status = error.status
    detail = error.data?.detail
  }

  return {
    status,
    detail,
  }
}

function Error({ error, onClose, ...props }) {
  const [isDismissed, setIsDismissed] = useState(false)
  const { status, detail } = getErrorMessage(error)

  function handleDismiss() {
    return onClose ? onClose() : setIsDismissed(true)
  }

  return (
    <>
      {isDismissed ? null : (
        <Alert variant="danger" onClose={handleDismiss} dismissible>
          <Alert.Heading>Error {status}</Alert.Heading>
          <p>Details: {detail}</p>
        </Alert>
      )}
    </>
  )
}

function FallbackError({ error, onClose }) {
  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Error error={error} onClose={onClose} />
    </Container>
  )
}

export { Error, FallbackError }
