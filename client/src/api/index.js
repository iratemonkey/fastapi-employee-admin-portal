import axios from 'axios'
import * as Auth from '../auth-provider'
import auth from './auth'
import user from './user'

const endpointUrl = url =>
  [process.env.REACT_APP_API_URL, process.env.REACT_APP_API_VERSION, url].join(
    '/',
  )

const getJwtToken = async () => {
  let token = null

  try {
    const { tokens } = await Auth.getToken()

    token = tokens.access.token
  } catch (err) {
    // ignore for now...
  }

  return token
}

// Add auth credentials to all outgoing API requests.
axios.interceptors.request.use(
  async config => {
    if (config.url.includes(process.env.REACT_APP_API_URL)) {
      const token = await getJwtToken()
      if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.authorization = `Bearer ${token}`
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// TODO: Fix linting
/* eslint-disable-next-line import/no-anonymous-default-export */
export default {
  auth: auth(endpointUrl),
  user: user(endpointUrl),
}
