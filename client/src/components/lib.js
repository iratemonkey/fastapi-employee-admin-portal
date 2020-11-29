import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

const Link = props => <RouterLink {...props} />

function ErrorMessage({ error, ...props }) {
  const errorMessage = error?.response?.data?.detail
  return (
    <div role="alert" {...props}>
      <span>There was an error: </span>
      <pre>{errorMessage || error.message}</pre>
    </div>
  )
}

export { ErrorMessage, Link, Spinner }
