// Auth context is handling all of the user authenticaiton logic
import * as React from 'react'
import { queryCache } from 'react-query'
import api from '../api'
import { useAsync } from '../hooks/useAsync'
import { FullPageSpinner, FullPageErrorFallback } from '../components/lib'

const { auth } = api

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    setData,
  } = useAsync()

  const login = React.useCallback(
    form => auth.login(form).then(user => setData(user)),
    [setData],
  )

  const register = React.useCallback(
    form => auth.register(form).then(user => setData(user)),
    [setData],
  )
  const logout = React.useCallback(() => {
    auth.logout()
    queryCache.clear()
    setData(null)
  }, [setData])

  const value = React.useMemo(() => ({ user, login, logout, register }), [
    login,
    logout,
    register,
    user,
  ])

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function useClient() {
  // const { user } = useAuth()
  // const token = user?.token
  // return React.useCallback(
  //   (endpoint, config) => auth(endpoint, { ...config, token }),
  //   [token],
  // )
}

export { AuthProvider, useAuth, useClient }
