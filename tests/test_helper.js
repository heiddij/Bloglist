const Blog = require('../models/blog')
const User = require('../models/user')

const blogsInDb = async () => {
    const blogsDb = await Blog.find({})
    return blogsDb.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = { blogsInDb, usersInDb }