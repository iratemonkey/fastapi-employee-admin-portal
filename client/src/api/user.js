import axios from 'axios'

const user = endpointUrl => ({
  find: params => {
    let queryParams = Object.assign({}, params)
    if (params && params.filter) {
      queryParams = Object.assign(queryParams, params.filter)
      delete queryParams.filter

      if (queryParams.includeInactive === 'on') {
        queryParams.includeInactive = true
      }
    }

    if (params && params.sort) {
      queryParams = Object.assign(queryParams, {
        sort: Object.keys(params.sort)
          .map(key => {
            return params.sort[key].toLowerCase() === 'desc' ? `-${key}` : key
          })
          .join(','),
      })
    }

    return axios.get(endpointUrl('users')).then(response => response.data)
  },
  findById: id =>
    axios.get(endpointUrl(`users/${id}`)).then(response => response.data),
  create: params =>
    axios.post(endpointUrl('users'), params).then(response => response.data),
  update: (id, params) =>
    axios
      .put(endpointUrl(`users/${id}`), params)
      .then(response => response.data),
  delete: id =>
    axios
      .patch(endpointUrl(`users/${id}`), { isActive: false })
      .then(response => response.data),
})

export default user
