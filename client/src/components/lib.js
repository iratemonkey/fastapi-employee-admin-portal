import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { FaSpinner } from 'react-icons/fa'

function Spinner() {
  return <FaSpinner id="spinner" aria-label="loading" />
}

function FullPageSpinner() {
  return <div>{Spinner()}</div>
}

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

function FullPageErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.detail}</pre>
    </div>
  )
}

export { FullPageErrorFallback, ErrorMessage, Spinner, FullPageSpinner, Link }
