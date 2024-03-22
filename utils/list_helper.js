const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item
    }
    return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const allLikes = blogs.map(blog => blog.likes)
    const maxLikes = Math.max(...allLikes)
    const favorite = blogs.find(blog => blog.likes === maxLikes)
    const { title, author, likes } = favorite

    return { title, author, likes }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}