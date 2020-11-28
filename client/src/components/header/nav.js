import React from 'react'
import { Link } from 'react-router-dom'

function NavLink(props) {
  return <Link {...props} />
}

function Nav(params) {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/employees">Employees</NavLink>
        </li>
        <li>
          <NavLink to="/finished">Finished Books</NavLink>
        </li>
        <li>
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
