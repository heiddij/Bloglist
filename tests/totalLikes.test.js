const listHelper = require('../utils/list_helper')
const blogs = require('./testdata')

describe('total likes', () => {
  test('total', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})