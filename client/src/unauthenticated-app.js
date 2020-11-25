import React, { useState } from 'react'
import { Spinner, ErrorMessage } from './components/lib'
import { Logo } from './components/logo'
import { useAuth } from './contexts/auth-context'
import { useAsync } from './hooks/useAsync'

function LoginForm({ onSubmit, submitButton }) {
  const { isLoading, isError, error, run } = useAsync()
  function handleSubmit(event) {
    event.preventDefault()
    const { username, password } = event.target.elements

    run(
      onSubmit({
        username: username.value,
        password: password.value,
      }),
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <div>
        {React.cloneElement(
          submitButton,
          { type: 'submit' },
          ...(Array.isArray(submitButton.props.children)
            ? submitButton.props.children
            : [submitButton.props.children]),
          isLoading ? <Spinner /> : null,
        )}
      </div>
      {isError ? <ErrorMessage error={error} /> : null}
    </form>
  )
}

function UnauthenticatedApp() {
  const [formState, setFormState] = useState('login')
  const { login, register } = useAuth()

  function handleToggleForm(event) {
    event.preventDefault()
    if (formState === 'login') {
      setFormState('register')
    } else {
      setFormState('login')
    }
  }

  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      {formState === 'login' ? (
        <div className="formGroup">
          <h2>Login</h2>
          <LoginForm onSubmit={login} submitButton={<button>Login</button>} />
          <button aria-label={formState} onClick={handleToggleForm}>
            register
          </button>
        </div>
      ) : (
        <div className="formGroup">
          <h2>Register</h2>
          <LoginForm
            onSubmit={register}
            submitButton={<button>Register</button>}
          />
          <button aria-label={formState} onClick={handleToggleForm}>
            login
          </button>
        </div>
      )}
    </div>
  )
}

export default UnauthenticatedApp
