import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { useAuth } from './contexts/auth-context'

// Screens
import EmployeesScreen from './screens/employees/employees'
import EmployeeScreen from './screens/employees/employee'
import ErrorScreen from './screens/errors/error-screen'

// Components
import { FallbackError } from './components/errors'
import Header from './components/header/header'

function AuthenticatedApp() {
  const { user, logout } = useAuth()
  return (
    <ErrorBoundary FallbackComponent={ErrorScreen}>
      <div>
        <Header user={user} logout={logout} />
        <main>
          <ErrorBoundary FallbackComponent={FallbackError}>
            <AppRoutes />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  )
}

function AppRoutes() {
  return (
    <Switch>
      <Route exact path="/employees">
        <EmployeesScreen />
      </Route>
      <Route exact path="/employees/:employeeId">
        <EmployeeScreen />
      </Route>
      <Route path="*" element={<ErrorScreen />} />
    </Switch>
  )
}

export default AuthenticatedApp
