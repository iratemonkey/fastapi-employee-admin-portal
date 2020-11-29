import axios from 'axios'
import auth from './auth'
import users from './users'
import employees from './employees'

const getEndPointUrl = url =>
  [process.env.REACT_APP_API_URL, process.env.REACT_APP_API_VERSION, url].join(
    '/',
  )

function api(endpoint, { token, headers: customHeaders } = {}) {
  // Add auth credentials to all outgoing API requests.
  axios.interceptors.request.use(
    async config => {
      if (config.url.includes(process.env.REACT_APP_API_URL)) {
        // const token = await getJwtToken()
        if (token) {
          // eslint-disable-next-line no-param-reassign
          config.headers['Authorization'] =
            `Bearer ${token?.access_token}` || undefined
        }
      }

      return config
    },
    error => {
      return Promise.reject(error)
    },
  )

  const endpoints = {
    auth: auth(getEndPointUrl, 'auth'),
    users: users(getEndPointUrl, 'users'),
    employees: employees(getEndPointUrl, 'employees'),
  }

  return endpoints[endpoint]
}

export default api
