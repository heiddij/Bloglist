import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, handleLike, deleteOne, user }) => {
  const [visible, setVisible] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('view')

  const toggleVisibility = () => {
    setVisible(!visible)

    if (visible) {
      setButtonLabel('view')
    } else {
      setButtonLabel('hide')
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}{' '}
      </Link>
      <button onClick={toggleVisibility}>{buttonLabel}</button>
      {visible ? (
        <div>
          <a href="{blog.url}">{blog.url}</a> <br />
          likes {blog.likes}{' '}
          <button onClick={() => handleLike(blog.id)}>like</button> <br />
          {blog.user && (
            <>
              {blog.user.name}
              <br />
            </>
          )}
          {blog.user && blog.user.username === user.username && (
            <button onClick={() => deleteOne(blog.id)}>remove</button>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default Blog
