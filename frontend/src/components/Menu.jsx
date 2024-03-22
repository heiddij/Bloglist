import { Link } from 'react-router-dom'

const Menu = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5
  }

  const menuStyle = {
    background: 'pink',
    padding: 10,
    borderWidth: 1,
    fontWeight: 'bold'
  }

  return (
    <div style={menuStyle}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Menu
