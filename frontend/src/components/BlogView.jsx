import { useParams } from 'react-router-dom'
import CommentForm from './CommentForm'
import { useEffect, useState } from 'react'
import blogService from '../services/blogs'

const BlogView = ({ blogs, handleLike }) => {
  const [comments, setComments] = useState([])
  const id = useParams().id
  const blog = blogs.find((b) => b.id === id)

  useEffect(() => {
    blogService.getComments(id).then((comments) => setComments(comments))
  }, [])

  if (!blog) {
    return null
  }

  const addComment = async (commentObject, id) => {
    await blogService.addComment(commentObject, id)
    setComments(comments.concat(commentObject))
  }

  return (
    <>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <a href="{blog.url}">{blog.url}</a> <br />
      {blog.likes} likes{' '}
      <button onClick={() => handleLike(blog.id)}>like</button> <br />
      {blog.user && <div>added by {blog.user.name}</div>}
      <h3>comments</h3>
      <CommentForm createComment={addComment} blog={blog} />
      {comments.length > 0 &&
        comments.map((comment) => <li key={comment.id}>{comment.content}</li>)}
    </>
  )
}

export default BlogView
