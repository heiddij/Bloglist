import { useState } from 'react'

const CommentForm = ({ createComment, blog }) => {
  const [content, setContent] = useState('')

  const addComment = (event) => {
    event.preventDefault()

    const commentObject = {
      content: content,
      blog: blog
    }

    createComment(commentObject, blog.id)

    setContent('')
  }

  return (
    <div>
      <form onSubmit={addComment}>
        <input
          type="text"
          value={content}
          name="Content"
          onChange={({ target }) => setContent(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
    </div>
  )
}

export default CommentForm
