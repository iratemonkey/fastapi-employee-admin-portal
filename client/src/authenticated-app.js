import React from 'react'
import { Switch, Route, Link as RouterLink } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorMessage, FullPageErrorFallback } from './components/lib'
import { useAuth } from './contexts/auth-context'
import { ReadingListScreen } from './screens/reading-list'
import { FinishedScreen } from './screens/finished'
import { DiscoverBooksScreen } from './screens/discover'
import { BookScreen } from './screens/book'
import { NotFoundScreen } from './screens/not-found'

function ErrorFallback({ error }) {
  return <ErrorMessage error={error} />
}

function AuthenticatedApp() {
  const { user, logout } = useAuth()
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <div>
        {user.username}
        <button onClick={logout}>Logout</button>
      </div>
      <div>
        <div>
          <Nav />
        </div>
        <main>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRoutes />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  )
}

function NavLink(props) {
  return <RouterLink {...props} />
}

function Nav(params) {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/list">Reading List</NavLink>
        </li>
        <li>
          <NavLink to="/finished">Finished Books</NavLink>
        </li>
        <li>
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  )
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/list" element={<ReadingListScreen />} />
      <Route path="/finished" element={<FinishedScreen />} />
      <Route path="/discover" element={<DiscoverBooksScreen />} />
      <Route path="/book/:bookId" element={<BookScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Switch>
  )
}

export default AuthenticatedApp
