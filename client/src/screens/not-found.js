import React from 'react'
import { Link } from '../components/lib'

function NotFoundScreen() {
  return (
    <div>
      <div>
        Sorry... nothing here. <Link to="/list">Go home</Link>
      </div>
    </div>
  )
}

export { NotFoundScreen }
