import axios from 'axios'

const LOCAL_STORAGE_KEY = process.env.REACT_APP_LOCAL_STORAGE_KEY

function handleUserResponse(token) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(token))
  return {}
}

function forceLogout() {
  window.localStorage.removeItem(LOCAL_STORAGE_KEY)
  return {}
}

const auth = (endpointUrl, entityPath) => ({
  login: ({ email, password }) => {
    const credentials = new FormData()
    credentials.append('username', email)
    credentials.append('password', password)

    return axios
      .post(endpointUrl(`${entityPath}/login`), credentials)
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
      .post(endpointUrl(`${entityPath}/register`), {
        email,
        password,
        attributes: { email, ...signUpParams },
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
  getToken() {
    const token = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    // if we were a real auth provider, this is where we would make a request
    // to retrieve the user's token. (It's a bit more complicated than that...
    // but you're probably not an auth provider so you don't need to worry about it).
    return JSON.parse(token)
  },
  isCurrentUser: () =>
    axios.get(endpointUrl(`${entityPath}/me`)).then(response => {
      if (response.status === 401) {
        forceLogout()
        window.location.assign(window.location)
        return Promise.reject({ message: 'Please re-authenticate' })
      }

      if (response.status === 200) {
        return response.data
      } else {
        return Promise.reject(response.data)
      }
    }),
  logout: refreshToken => {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY)
    return
  },
  forgotPassword: email => {
    return axios.post(endpointUrl(`${entityPath}/forgot-password`), email)
  },
  resetPassword: newPassword =>
    axios.post(endpointUrl(`${entityPath}/reset-password`), newPassword),
})

export default auth
