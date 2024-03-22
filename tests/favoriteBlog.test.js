const listHelper = require('../utils/list_helper')
const blogs = require('./testdata')

describe('favorite blog', () => {
  test('most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    console.log(result)
    const { title, author, likes } = blogs[2]
    expect(result).toEqual({ title, author, likes })
  })
})