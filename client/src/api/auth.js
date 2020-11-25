import axios from 'axios'

const localStorageKey = '__auth_provider_token__'

function handleUserResponse(token) {
  window.localStorage.setItem(localStorageKey, JSON.stringify(token))
  return {}
}

function forceLogout() {
  window.localStorage.removeItem(localStorageKey)
  return {}
}

const auth = endpointUrl => ({
  login: ({ email, password }) => {
    return axios
      .post(endpointUrl(`auth/login`), {
        email,
        password,
      })
      .then(response => {
        if (response.status === 200) {
          handleUserResponse(response.data)
          return response.data
        } else {
          return Promise.reject(response)
        }
      })
  },
  register: params => {
    const { email: rawEmail, password, ...signUpParams } = params
    const email = rawEmail.toLowerCase()

    return axios
      .post(endpointUrl(`auth/register`), {
        email,
        password,
        attributes: { email, ...signUpParams },
      })
      .then(response => {
        response.user.password = password
        response.user.email = email
        return response
      })
  },
  getToken() {
    const token = window.localStorage.getItem(localStorageKey)
    // if we were a real auth provider, this is where we would make a request
    // to retrieve the user's token. (It's a bit more complicated than that...
    // but you're probably not an auth provider so you don't need to worry about it).
    return JSON.parse(token)
  },
  isCurrentUser: id =>
    axios.get(endpointUrl(`auth/me/${id}`)).then(response => {
      if (response.statusText === 401) {
        forceLogout()
        window.location.assign(window.location)
        return Promise.reject({ message: 'Please re-authenticate' })
      }

      if (response.statusText === 200) {
        return response.data
      } else {
        return Promise.reject(response.data)
      }
    }),
  logout: refreshToken => {
    window.localStorage.removeItem(localStorageKey)
    return axios.post(endpointUrl(`auth/register`), {
      refreshToken,
    })
  },
  forgotPassword: email => {
    return axios.post(endpointUrl('/auth/forgot-password'), email)
  },
  resetPassword: newPassword =>
    axios.post(endpointUrl('auth/reset-password'), newPassword),
})

export default auth
