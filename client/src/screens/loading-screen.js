import React from 'react'
import { Alert, Container, Spinner } from 'react-bootstrap'

function LoadingScreen() {
  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Alert variant="light">
        <Alert.Heading>Loading...</Alert.Heading>
        <hr />
        <div className="d-flex justify-content-center ">
          <Spinner
            animation="border"
            variant="primary"
            role="status"
            size="xl"
          />
        </div>
      </Alert>
    </Container>
  )
}

export default LoadingScreen
