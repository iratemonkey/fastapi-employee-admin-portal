import React from 'react'
import { Table } from 'react-bootstrap'

function ListTable({ data }) {
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
              <td>{item.first_name}</td>
              <td>{item.last_name}</td>
              <td>{item.email}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ListTable
