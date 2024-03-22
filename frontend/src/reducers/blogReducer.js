import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import store from '../store'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    like(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id
          ? blog
          : { ...updatedBlog, user: blog.user && blog.user }
      )
    },
    remove(state, action) {
      const removedBlog = action.payload
      return state.filter((blog) => blog.id !== removedBlog.id)
    }
  }
})

export const { setBlogs, appendBlog, like, remove } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject)
    const addedBlog = { ...newBlog, user: blogObject.user }
    dispatch(appendBlog(addedBlog))
  }
}

export const updateBlog = (id) => {
  return async (dispatch) => {
    const blogs = store.getState().blogs
    const blogToLike = blogs.find((b) => b.id === id)
    const likedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1
    }
    const updatedBlog = await blogService.update(id, likedBlog)
    dispatch(like(updatedBlog))
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    const blogs = store.getState().blogs
    const blogToRemove = blogs.find((b) => b.id === id)
    window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author} ?`
    )
    await blogService.deleteBlog(id)
    dispatch(remove(blogToRemove))
  }
}

export default blogSlice.reducer
