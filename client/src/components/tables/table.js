import React from 'react'
import { Table } from 'react-bootstrap'
import { capitalize } from '../../utils/string'
import { Link } from 'react-router-dom'

function ListTable({ data, listType, isLoading }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => {
          return (
            <tr key={item.id}>
              <td>
                {isLoading ? (
                  capitalize(item.first_name)
                ) : (
                  <Link to={`${listType}/${item.id}`}>
                    {capitalize(item.first_name)}
                  </Link>
                )}
              </td>
              <td>{capitalize(item.last_name)}</td>
              <td>{item.email}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ListTable
