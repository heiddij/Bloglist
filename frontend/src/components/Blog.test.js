import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders only title and author', () => {
  const blog = {
    title: 'Helllloooo',
    author: 'Joku Tyyppi',
    url: 'moro.fi',
    likes: 5
  }

  render(<Blog blog={blog} />)

  screen.debug()

  const element = screen.getByText('Helllloooo Joku Tyyppi')
  expect(element).toBeDefined()

  const element2 = screen.queryByText('moro.fi', { exact: false })
  expect(element2).toBeNull()

  const element3 = screen.queryByText('5', { exact: false })
  expect(element3).toBeNull()
})

test('renders all information when view button is clicked', async () => {
  const user = {
    username: 'joku',
    name: 'Mina Vain',
    password: 'joku',
    id: 123
  }

  const blog = {
    title: 'Helllloooo',
    author: 'Joku Tyyppi',
    url: 'moro.fi',
    likes: 5,
    user: user
  }

  render(<Blog blog={blog} user={user} />)

  const user2 = userEvent.setup()

  const button = screen.getByText('view')
  await user2.click(button)

  screen.debug()

  const element = screen.getByText('Helllloooo Joku Tyyppi')
  expect(element).toBeDefined()

  const element2 = screen.getByText('moro.fi', { exact: false })
  expect(element2).toBeDefined()

  const element3 = screen.getByText('5', { exact: false })
  expect(element3).toBeDefined()

  const element4 = screen.getByText(user.name, { exact: false })
  expect(element4).toBeDefined()
})

test('renders all information when view button is clicked', async () => {
  const user = {
    username: 'joku',
    name: 'Mina Vain',
    password: 'joku',
    id: 123
  }

  const blog = {
    title: 'Helllloooo',
    author: 'Joku Tyyppi',
    url: 'moro.fi',
    likes: 5,
    user: user
  }

  const user2 = userEvent.setup()
  const mockHandler = jest.fn()

  render(<Blog blog={blog} user={user} handleLike={mockHandler} />)

  const viewButton = screen.getByText('view')
  await user2.click(viewButton)

  const likeButton = screen.getByText('like')
  await user2.click(likeButton)
  await user2.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
