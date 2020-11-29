import axios from 'axios'

const employees = (endpointUrl, entityPath) => ({
  find: params => {
    return axios
      .get(endpointUrl(`${entityPath}?details=${params}`))
      .then(response => response.data)
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
      .patch(endpointUrl(`${entityPath}/${id}`))
      .then(response => response.data),
})

export default employees
