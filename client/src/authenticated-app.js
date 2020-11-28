import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorMessage, FullPageErrorFallback } from './components/lib'
import { useAuth } from './contexts/auth-context'

// Screens
import EmployeesScreen from './screens/employees/employees'
import { FinishedScreen } from './screens/finished'
import { DiscoverBooksScreen } from './screens/discover'
import { BookScreen } from './screens/book'
import { NotFoundScreen } from './screens/not-found'

// Components
import Header from './components/header/header'

function ErrorFallback({ error }) {
  return <ErrorMessage error={error} />
}

function AuthenticatedApp() {
  const { user, logout } = useAuth()
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <div>
        <Header user={user} logout={logout} />
        <main>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
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
      <Route path="/employees">
        <EmployeesScreen />
      </Route>
      <Router path="employees/:employeeId">
        <BookScreen />
      </Router>
      <Router path="/users">
        <FinishedScreen />
      </Router>
      <Route path="*" element={<NotFoundScreen />} />
    </Switch>
  )
}

export default AuthenticatedApp
