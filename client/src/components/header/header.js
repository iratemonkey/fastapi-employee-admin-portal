import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'

function Header({ user, logout }) {
  const { email, id } = user

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">FastAPI Employee Database</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/employees">Employees</Nav.Link>
          <Nav.Link href="/users">Users</Nav.Link>
        </Nav>
        <Nav.Link href={`/users/${id}`}>{email}</Nav.Link>
        <Button variant="outline-primary" onClick={logout}>
          Logout
        </Button>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
