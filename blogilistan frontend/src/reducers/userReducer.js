import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const { setUser } = userSlice.actions

/* export const loginUser = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({
      // user sisältää myös tokenin
      username,
      password
    })

    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    dispatch(setUser(user))
    blogService.setToken(user.token)
  }
}

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.clear()
    dispatch(setUser(null))
  }
} */

export const passUser = (user) => {
  return async (dispatch) => {
    dispatch(setUser(user))
  }
}

export default userSlice.reducer
