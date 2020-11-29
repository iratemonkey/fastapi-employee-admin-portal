import React from 'react'
import { useAuth } from './contexts/auth-context'
import LoadingScreen from './screens/loading-screen'

const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ './authenticated-app'),
)
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

function App() {
  const { user } = useAuth()
  return (
    <React.Suspense fallback={<LoadingScreen />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export default App
