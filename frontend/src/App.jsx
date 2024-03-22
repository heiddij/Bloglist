/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import UserList from './components/UserList'
import { setNotification } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
  initializeBlogs,
  createBlog,
  updateBlog,
  removeBlog
} from './reducers/blogReducer'
import { passUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import { Link, Routes, Route } from 'react-router-dom'
import loginService from './services/login'
import BlogList from './components/BlogList'
import User from './components/User'
import BlogView from './components/BlogView'
import Menu from './components/Menu'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    fontWeight: 'bold'
  }

  if (notification === null) {
    return null
  }

  return (
    <>
      <div style={style}>{notification}</div>
      <br />
    </>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [])

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(passUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        // user sisältää myös tokenin
        username,
        password
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      dispatch(passUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('Wrong username or password', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(passUser(null))
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))

    dispatch(
      setNotification(
        `A new blog '${blogObject.title}' by ${blogObject.author} added!`,
        5
      )
    )
  }

  const handleLike = async (id) => {
    dispatch(updateBlog(id))
  }

  const deleteOne = async (id) => {
    dispatch(removeBlog(id))
  }

  const loginForm = () => (
    <div>
      <h2>Please log in.</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )

  return (
    <>
      <h1>Blogs</h1>
      <Notification />
      {!user && loginForm()}
      {user && (
        <div>
          <Menu user={user} handleLogout={handleLogout} />
          <Routes>
            <Route
              path="/"
              element={
                <BlogList
                  blogs={blogs}
                  user={user}
                  handleLike={handleLike}
                  deleteOne={deleteOne}
                  blogFormRef={blogFormRef}
                  addBlog={addBlog}
                />
              }
            />
            <Route path="/users/*" element={<UserList />} />
            <Route path="/users/:id" element={<User users={users} />} />
            <Route
              path="/blogs/:id"
              element={<BlogView blogs={blogs} handleLike={handleLike} />}
            />
          </Routes>
        </div>
      )}
    </>
  )
}

export default App
