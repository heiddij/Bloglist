import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UserList = () => {
  const users = useSelector((state) => state.users)

  const style = {
    fontWeight: 'bold'
  }

  return (
    <>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <td style={style}>Names</td>
            <td style={style}>Blogs created</td>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default UserList
