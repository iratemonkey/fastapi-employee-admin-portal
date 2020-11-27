import React, { useState } from 'react'
import { useAuth } from './contexts/auth-context'
import LoginForm from './components/login-form'

function UnauthenticatedApp() {
  const [formState, setFormState] = useState('Login')
  const { login, register } = useAuth()

  function handleToggleForm(event) {
    event.preventDefault()
    if (formState === 'Login') {
      setFormState('Register')
    } else {
      setFormState('Login')
    }
  }

  return (
    <div>
      <LoginForm
        onSubmit={formState === 'Login' ? login : register}
        handleToggleForm={handleToggleForm}
        formState={formState}
      />
    </div>
  )
}

export default UnauthenticatedApp
