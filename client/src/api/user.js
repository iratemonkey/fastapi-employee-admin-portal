import axios from 'axios'

const user = (endpointUrl, entityPath) => ({
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

    return axios.get(endpointUrl(entityPath)).then(response => response.data)
  },
  findById: id =>
    axios
      .get(endpointUrl(`${entityPath}/${id}`))
      .then(response => response.data),
  create: params =>
    axios.post(endpointUrl(entityPath), params).then(response => response.data),
  update: (id, params) =>
    axios
      .put(endpointUrl(`${entityPath}/${id}`), params)
      .then(response => response.data),
  delete: id =>
    axios
      .patch(endpointUrl(`${entityPath}/${id}`), { isActive: false })
      .then(response => response.data),
})

export default user
