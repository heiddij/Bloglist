import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  const usr = {
    username: 'joku',
    name: 'Mina Vain',
    password: 'joku',
    id: 123
  }

  const { container } = render(<BlogForm createBlog={createBlog} user={usr} />)

  const inputTitle = container.querySelector('#title')
  const inputAuthor = container.querySelector('#author')
  const inputUrl = container.querySelector('#url')
  const sendButton = screen.getByText('save')

  await user.type(inputTitle, 'Testien tekeminen on tylsaa')
  await user.type(inputAuthor, 'Laiskamato')
  await user.type(inputUrl, 'laiskatparjaa.fi')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testien tekeminen on tylsaa')
  expect(createBlog.mock.calls[0][0].author).toBe('Laiskamato')
  expect(createBlog.mock.calls[0][0].url).toBe('laiskatparjaa.fi')
})
